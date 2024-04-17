import { reactive } from 'vue'
import { storageService } from '@/utils/storage'

interface User {
  username: string
  balance: number
  portfolio: any[]
}

function loadInitialState(): User {
  const loggedUser = localStorage.getItem('loggedInUser')
  const userDetails = loggedUser ? storageService.getUser(loggedUser) : null
  return {
    username: userDetails?.username ?? '',
    balance: userDetails?.balance ?? 0,
    portfolio: userDetails?.portfolio ?? []
  }
}

const userState = reactive<User>(loadInitialState())

function updateUserState() {
  Object.assign(userState, loadInitialState())
}

export function useUserState() {
  return { userState, updateUserState }
}
