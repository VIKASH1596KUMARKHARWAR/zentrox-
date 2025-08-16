'use client'
import React, { useEffect, useRef } from 'react'
import * as LR from '@uploadcare/blocks'
import { useRouter } from 'next/navigation'

type Props = {
  onUpload: (url: string) => Promise<any> | any
}

LR.registerBlocks(LR)

const UploadCareButton = ({ onUpload }: Props) => {
  const router = useRouter()

  // Use the correct ref type
  const ctxProviderRef = useRef<InstanceType<typeof LR.UploadCtxProvider> | null>(null)

  useEffect(() => {
    const handleUpload = async (e: CustomEvent) => {
      const file = await onUpload(e.detail.cdnUrl)
      if (file) {
        router.refresh()
      }
    }

    const currentRef = ctxProviderRef.current
    if (currentRef) {
      currentRef.addEventListener('file-upload-success', handleUpload as EventListener)
    }

    // cleanup on unmount
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('file-upload-success', handleUpload as EventListener)
      }
    }
  }, [onUpload, router])

  return (
    <div>
      <lr-config
        ctx-name="my-uploader"
        pubkey="a9428ff5ff90ae7a64eb"
      />

      <lr-file-uploader-regular
        ctx-name="my-uploader"
        css-src="https://cdn.jsdelivr.net/npm/@uploadcare/blocks@0.35.2/web/lr-file-uploader-regular.min.css"
      />

      <lr-upload-ctx-provider
        ctx-name="my-uploader"
        ref={ctxProviderRef}
      />
    </div>
  )
}

export default UploadCareButton
