import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUserState } from './userState'

describe('userState', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('deposit funcionality', () => {
    it('increases balance for positive input', () => {
      const userStore = useUserState()
      expect(userStore.balance).toBe(0)
      userStore.deposit(300)
      expect(userStore.balance).toBe(300)
      userStore.deposit(700)
      expect(userStore.balance).toBe(1000)
    })

    it('does not increase balance for any non-positive or zero input', () => {
      const userStore = useUserState()
      userStore.deposit(0)
      expect(userStore.balance).toBe(0)
      userStore.deposit(-300)
      expect(userStore.balance).toBe(0)
    })
  })

  describe('withdraw funcionlity', () => {
    it('decreases balance succesfully', () => {
      const userStore = useUserState()
      userStore.deposit(700)
      userStore.withdraw(300)
      expect(userStore.balance).toBe(400)
    })

    it('does not allow withdraw more than there are in the balance', () => {
      const userStore = useUserState()
      userStore.deposit(700)
      expect(() => userStore.withdraw(1000)).toThrowError()
      expect(userStore.balance).toBe(700)
    })
  })
})
