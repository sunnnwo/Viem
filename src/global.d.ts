// src/global.d.ts
import { EIP1193Provider } from 'viem'

declare global {
  interface Window {
    // any 대신 viem의 공식 타입을 사용합니다.
    ethereum?: EIP1193Provider
  }
}

export {}