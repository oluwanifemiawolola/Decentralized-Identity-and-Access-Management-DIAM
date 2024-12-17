;; Access Control Contract

(define-constant contract-owner tx-sender)
(define-constant err-not-authorized (err u403))

(define-map roles
  { role: (string-ascii 64) }
  { members: (list 100 principal) }
)

(define-map resources
  { resource: (string-ascii 64) }
  { required-role: (string-ascii 64) }
)

(define-public (add-role (role (string-ascii 64)))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-not-authorized)
    (ok (map-set roles { role: role } { members: (list) }))
  )
)

(define-public (assign-role (user principal) (role (string-ascii 64)))
  (let
    (
      (role-data (unwrap! (map-get? roles { role: role }) (err u404)))
    )
    (asserts! (is-eq tx-sender contract-owner) err-not-authorized)
    (ok (map-set roles
      { role: role }
      { members: (unwrap! (as-max-len? (append (get members role-data) user) u100) (err u500)) }
    ))
  )
)

(define-public (revoke-role (user principal) (role (string-ascii 64)))
  (let
    (
      (role-data (unwrap! (map-get? roles { role: role }) (err u404)))
    )
    (asserts! (is-eq tx-sender contract-owner) err-not-authorized)
    (ok (map-set roles
      { role: role }
      { members: (filter not-user (get members role-data)) }
    ))
  )
)

(define-private (not-user (member principal))
  (not (is-eq member tx-sender))
)

(define-public (set-resource-access (resource (string-ascii 64)) (required-role (string-ascii 64)))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-not-authorized)
    (ok (map-set resources { resource: resource } { required-role: required-role }))
  )
)

(define-read-only (check-access (user principal) (resource (string-ascii 64)))
  (let
    (
      (resource-data (unwrap! (map-get? resources { resource: resource }) (err u404)))
      (role-data (unwrap! (map-get? roles { role: (get required-role resource-data) }) (err u404)))
    )
    (ok (is-some (index-of (get members role-data) user)))
  )
)

