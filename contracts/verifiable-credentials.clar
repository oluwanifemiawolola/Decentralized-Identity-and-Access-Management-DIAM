;; Verifiable Credentials Contract

(define-constant issuer tx-sender)
(define-constant err-not-issuer (err u403))
(define-constant err-invalid-signature (err u401))

(define-map credentials
  { id: uint }
  {
    subject: principal,
    type: (string-ascii 64),
    data: (string-utf8 1024),
    issued-at: uint,
    expires-at: uint,
    revoked: bool
  }
)

(define-data-var credential-counter uint u0)

(define-public (issue-credential
    (subject principal)
    (type (string-ascii 64))
    (data (string-utf8 1024))
    (valid-for uint))
  (let
    (
      (id (var-get credential-counter))
      (issued-at block-height)
      (expires-at (+ block-height valid-for))
    )
    (asserts! (is-eq tx-sender issuer) err-not-issuer)
    (var-set credential-counter (+ id u1))
    (ok (map-set credentials
      { id: id }
      {
        subject: subject,
        type: type,
        data: data,
        issued-at: issued-at,
        expires-at: expires-at,
        revoked: false
      }
    ))
  )
)

(define-public (revoke-credential (id uint))
  (let
    (
      (credential (unwrap! (map-get? credentials { id: id }) (err u404)))
    )
    (asserts! (is-eq tx-sender issuer) err-not-issuer)
    (ok (map-set credentials
      { id: id }
      (merge credential { revoked: true })
    ))
  )
)

(define-read-only (verify-credential (id uint) (signature (buff 65)))
  (let
    (
      (credential (unwrap! (map-get? credentials { id: id }) (err u404)))
    )
    (asserts! (and
      (not (get revoked credential))
      (<= block-height (get expires-at credential))
    ) (err u401))
    ;; TODO: Implement actual signature verification
    ;; For now, we'll assume the signature is valid if it's not empty
    (asserts! (> (len signature) u0) err-invalid-signature)
    (ok true)
  )
)

(define-read-only (get-credential (id uint))
  (ok (unwrap! (map-get? credentials { id: id }) (err u404)))
)

