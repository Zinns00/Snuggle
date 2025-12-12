'use client'

import { useEffect, useState, useRef } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'error'
  isVisible: boolean
  onClose: () => void
}

export default function Toast({ message, type = 'success', isVisible, onClose }: ToastProps) {
  const [visible, setVisible] = useState(false)
  const [animate, setAnimate] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isVisible) {
      // 이전 타이머 클리어
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      setVisible(true)
      // 다음 프레임에서 애니메이션 시작
      setTimeout(() => setAnimate(true), 10)

      // 2.5초 후 사라지기 시작
      timeoutRef.current = setTimeout(() => {
        setAnimate(false)
        // 애니메이션 완료 후 숨기기
        setTimeout(() => {
          setVisible(false)
          onClose()
        }, 300)
      }, 2500)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [isVisible, message])

  if (!visible) return null

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div
        className={`flex items-center gap-2 rounded-full px-5 py-3 shadow-lg transition-all duration-300 ease-out ${
          animate
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-3 opacity-0 scale-95'
        } ${
          type === 'success'
            ? 'bg-black text-white dark:bg-white dark:text-black'
            : 'bg-red-500 text-white'
        }`}
      >
        {type === 'success' ? (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )}
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  )
}
