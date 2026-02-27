import React from 'react'
import homeAssIcon from '../images/homeassisant_icon.png'
import viteIcon from '../images/vite_icon.png'
import tsIcon from '../images/typescript_icon.png'
import reactIcon from '../images/react_icon.svg'
import ollamaIcon from '../images/ollama_icon.png'
import dockerIcon from '../images/docker_icon.png'
import zigbeeIcon from '../images/zigbee_icon.png'
import iotIcon from '../images/iot_icon.png'
import csharpIcon from '../images/csharp_icon.png'
import dotnetIcon from '../images/dotnet_icon.png'

type Props = {
  tech: string
  className?: string
}

export default function TechIcon({ tech, className }: Props) {
  const t = tech.toLowerCase()

  const initials = (s: string) =>
    s
      .split(/[^a-z0-9]+/i)
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()

  if (t.includes('react')) {
    return (
      <span className={`${className ?? ''} inline-block rounded-md overflow-hidden`}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={reactIcon} className="w-full h-full object-cover" alt="React" />
      </span>
    )
  }

  if (t.includes('typescript') || t === 'ts') {
    return (
      <span className={`${className ?? ''} inline-block rounded-md overflow-hidden`}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={tsIcon} className="w-full h-full object-cover" alt="TypeScript" />
      </span>
    )
  }

  if (t.includes('vite')) {
    return (
      <span className={`${className ?? ''} inline-block rounded-md overflow-hidden`}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={viteIcon} className="w-full h-full object-cover" alt="Vite" />
      </span>
    )
  }

  if (t.includes('tailwind')) {
    return (
      <span className={`${className ?? ''} inline-block rounded-md overflow-hidden`}>
        <svg className="w-full h-full" viewBox="0 0 24 24" aria-hidden>
          <rect width="24" height="24" rx="4" fill="#06b6d4" />
          <path d="M4 14s3-4 8-4 8 4 8 4v2s-3-3-8-3-8 3-8 3v-2z" fill="#fff" opacity="0.95" />
        </svg>
      </span>
    )
  }

  if (t.includes('home assistant') || t.includes('homeassistant') || t.includes('home assistant os')) {
    return (
      <span className={`${className ?? ''} inline-block rounded-md overflow-hidden`}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={homeAssIcon} className="w-full h-full object-cover" alt="Home Assistant" />
      </span>
    )
  }

  if (t.includes('docker')) {
    return (
      <span className={`${className ?? ''} inline-block rounded-md overflow-hidden`}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={dockerIcon} className="w-full h-full object-cover" alt="Docker" />
      </span>
    )
  }

  if (t.includes('zigbee')) {
    return (
      <span className={`${className ?? ''} inline-block rounded-md overflow-hidden`}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={zigbeeIcon} className="w-full h-full object-cover" alt="Zigbee" />
      </span>
    )
  }

  if (t.includes('iot') || t.includes('iot automation') || t.includes('iotautomation')) {
    return (
      <span className={`${className ?? ''} inline-block rounded-md overflow-hidden`}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={iotIcon} className="w-full h-full object-cover" alt="IoT Automation" />
      </span>
    )
  }

  if (t.includes('llama') || t.includes('ollama')) {
    return (
      <span className={`${className ?? ''} inline-block rounded-md overflow-hidden`}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={ollamaIcon} className="w-full h-full object-cover" alt="Llama" />
      </span>
    )
  }

  if (t === 'c#' || t.includes('c#') || t.includes('csharp')) {
    return (
      <span className={`${className ?? ''} inline-block rounded-md overflow-hidden`}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={csharpIcon} className="w-full h-full object-cover" alt="C#" />
      </span>
    )
  }

  if (t.includes('.net') || t.includes('dotnet')) {
    return (
      <span className={`${className ?? ''} inline-block rounded-md overflow-hidden`}>
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <img src={dotnetIcon} className="w-full h-full object-cover" alt=".NET" />
      </span>
    )
  }

  if (t.includes('pnpm')) {
    return (
      <span className={`${className ?? ''} inline-block rounded-md overflow-hidden`}>
        <svg className="w-full h-full" viewBox="0 0 24 24" aria-hidden>
          <rect width="24" height="24" rx="4" fill="#F69220" />
          <text x="50%" y="55%" textAnchor="middle" fontSize="9" fill="#fff" fontFamily="Inter, system-ui">PN</text>
        </svg>
      </span>
    )
  }

  if (t.includes('react router') || t.includes('router')) {
    return (
      <span className={`${className ?? ''} inline-block rounded-md overflow-hidden`}>
        <svg className="w-full h-full" viewBox="0 0 24 24" aria-hidden>
          <rect width="24" height="24" rx="4" fill="#8b5cf6" />
          <text x="50%" y="55%" textAnchor="middle" fontSize="8" fill="#fff" fontFamily="Inter, system-ui">RR</text>
        </svg>
      </span>
    )
  }

  if (t.includes('vitest')) {
    return (
      <span className={`${className ?? ''} inline-block rounded-md overflow-hidden`}>
        <svg className="w-full h-full" viewBox="0 0 24 24" aria-hidden>
          <rect width="24" height="24" rx="4" fill="#7c3aed" />
          <text x="50%" y="55%" textAnchor="middle" fontSize="8" fill="#fff" fontFamily="Inter, system-ui">VT</text>
        </svg>
      </span>
    )
  }

  // Fallback: small rounded badge with initials
  return (
    <span className={`${className ?? ''} inline-block rounded-md overflow-hidden`}>
      <svg className="w-full h-full" viewBox="0 0 24 24" aria-hidden>
        <rect width="24" height="24" rx="4" fill="#374151" />
        <text x="50%" y="55%" textAnchor="middle" fontSize="8" fill="#fff" fontFamily="Inter, system-ui">{initials(tech)}</text>
      </svg>
    </span>
  )
}
