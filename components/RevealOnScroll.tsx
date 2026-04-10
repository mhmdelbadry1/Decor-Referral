'use client'

import { useEffect, useRef } from 'react'

interface RevealOnScrollProps {
  children: React.ReactNode
  className?: string
  /** 'reveal' = single element fade-up; 'stagger' = children stagger in */
  variant?: 'reveal' | 'stagger'
  threshold?: number
  delay?: number
}

/**
 * Wraps children and adds an IntersectionObserver-driven entrance animation.
 * Adds the 'in' class when the element enters the viewport, which activates
 * the `.reveal` or `.stagger` CSS animations defined in globals.css.
 *
 * Respects prefers-reduced-motion: the CSS transitions are only applied
 * when motion is OK (handled by the browser via CSS).
 */
export default function RevealOnScroll({
  children,
  className = '',
  variant = 'reveal',
  threshold = 0.12,
  delay = 0,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in')
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return (
    <div 
      ref={ref} 
      className={`${variant} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
