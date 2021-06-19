import { useEffect } from "react"

type Args = {
  callback: () => void,
}

export const useBeforeUnload = ({ callback }: Args) => {
  useEffect(() => {
    const handleBeforeUnload = () => {
      callback()
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [callback])
}