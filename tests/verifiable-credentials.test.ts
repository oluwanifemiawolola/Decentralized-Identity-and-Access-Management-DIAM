import { describe, it, expect, beforeEach, vi } from 'vitest';

const callReadOnlyFunction = vi.fn();
vi.mock('@stacks/transactions', () => ({
  callReadOnlyFunction,
}));

describe('verifiable-credentials contract', () => {
  let clarityBitcoin; // = mockClarityBitcoin();
  
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  describe('issue-credential', () => {
    it('should successfully issue a credential', async () => {
      callReadOnlyFunction.mockResolvedValueOnce({ okay: true, result: 'true' });
      const result = await callReadOnlyFunction({
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        contractName: 'verifiable-credentials',
        functionName: 'issue-credential',
        functionArgs: ['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', 'education', 'Bachelor of Science', '100'],
        senderAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      });
      expect(result.okay).toBe(true);
      expect(result.result).toBe('true');
    });
    
    it('should fail when non-issuer tries to issue a credential', async () => {
      callReadOnlyFunction.mockResolvedValueOnce({ okay: false, error: 'u403' });
      const result = await callReadOnlyFunction({
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        contractName: 'verifiable-credentials',
        functionName: 'issue-credential',
        functionArgs: ['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', 'education', 'Bachelor of Science', '100'],
        senderAddress: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
      });
      expect(result.okay).toBe(false);
      expect(result.error).toBe('u403');
    });
  });
  
  describe('revoke-credential', () => {
    it('should successfully revoke a credential', async () => {
      callReadOnlyFunction.mockResolvedValueOnce({ okay: true, result: 'true' });
      await callReadOnlyFunction({
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        contractName: 'verifiable-credentials',
        functionName: 'issue-credential',
        functionArgs: ['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', 'education', 'Bachelor of Science', '100'],
        senderAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      });
      callReadOnlyFunction.mockResolvedValueOnce({ okay: true, result: 'true' });
      const result = await callReadOnlyFunction({
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        contractName: 'verifiable-credentials',
        functionName: 'revoke-credential',
        functionArgs: ['u0'],
        senderAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      });
      expect(result.okay).toBe(true);
      expect(result.result).toBe('true');
    });
    
    it('should fail when non-issuer tries to revoke a credential', async () => {
      callReadOnlyFunction.mockResolvedValueOnce({ okay: true, result: 'true' });
      await callReadOnlyFunction({
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        contractName: 'verifiable-credentials',
        functionName: 'issue-credential',
        functionArgs: ['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', 'education', 'Bachelor of Science', '100'],
        senderAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      });
      callReadOnlyFunction.mockResolvedValueOnce({ okay: false, error: 'u403' });
      const result = await callReadOnlyFunction({
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        contractName: 'verifiable-credentials',
        functionName: 'revoke-credential',
        functionArgs: ['u0'],
        senderAddress: 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG',
      });
      expect(result.okay).toBe(false);
      expect(result.error).toBe('u403');
    });
  });
  
  describe('verify-credential', () => {
    it('should successfully verify a valid credential', async () => {
      callReadOnlyFunction.mockResolvedValueOnce({ okay: true, result: 'true' });
      await callReadOnlyFunction({
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        contractName: 'verifiable-credentials',
        functionName: 'issue-credential',
        functionArgs: ['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', 'education', 'Bachelor of Science', '100'],
        senderAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      });
      callReadOnlyFunction.mockResolvedValueOnce({ okay: true, result: 'true' });
      const result = await callReadOnlyFunction({
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        contractName: 'verifiable-credentials',
        functionName: 'verify-credential',
        functionArgs: ['u0', '0x0123456789abcdef'],
        senderAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      });
      expect(result.okay).toBe(true);
      expect(result.result).toBe('true');
    });
    
    it('should fail to verify a revoked credential', async () => {
      callReadOnlyFunction.mockResolvedValueOnce({ okay: true, result: 'true' });
      await callReadOnlyFunction({
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        contractName: 'verifiable-credentials',
        functionName: 'issue-credential',
        functionArgs: ['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', 'education', 'Bachelor of Science', '100'],
        senderAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      });
      callReadOnlyFunction.mockResolvedValueOnce({ okay: true, result: 'true' });
      await callReadOnlyFunction({
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        contractName: 'verifiable-credentials',
        functionName: 'revoke-credential',
        functionArgs: ['u0'],
        senderAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      });
      callReadOnlyFunction.mockResolvedValueOnce({ okay: false, error: 'u401' });
      const result = await callReadOnlyFunction({
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        contractName: 'verifiable-credentials',
        functionName: 'verify-credential',
        functionArgs: ['u0', '0x0123456789abcdef'],
        senderAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      });
      expect(result.okay).toBe(false);
      expect(result.error).toBe('u401');
    });
  });
  
  describe('get-credential', () => {
    it('should retrieve an existing credential', async () => {
      callReadOnlyFunction.mockResolvedValueOnce({ okay: true, result: 'true' });
      await callReadOnlyFunction({
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        contractName: 'verifiable-credentials',
        functionName: 'issue-credential',
        functionArgs: ['ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', 'education', 'Bachelor of Science', '100'],
        senderAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      });
      callReadOnlyFunction.mockResolvedValueOnce({ okay: true, result: '{"credential": "Bachelor of Science"}' });
      const result = await callReadOnlyFunction({
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        contractName: 'verifiable-credentials',
        functionName: 'get-credential',
        functionArgs: ['u0'],
        senderAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      });
      expect(result.okay).toBe(true);
      expect(result.result).toContain('Bachelor of Science');
    });
    
    it('should fail when retrieving a non-existent credential', async () => {
      callReadOnlyFunction.mockResolvedValueOnce({ okay: false, error: 'u404' });
      const result = await callReadOnlyFunction({
        contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        contractName: 'verifiable-credentials',
        functionName: 'get-credential',
        functionArgs: ['u999'],
        senderAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      });
      expect(result.okay).toBe(false);
      expect(result.error).toBe('u404');
    });
  });
});
