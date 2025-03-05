// DropdownColorPicker.tsx

'use client'

import React, { useEffect, useState } from 'react'
import { ColorPickerWrapper } from './ColorPicker'
import { $getSelection, $isRangeSelection } from 'lexical'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $patchStyleText } from '@lexical/selection'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FontColorIcon } from '../icons/FontColorIcon'

export const DropdownColorPicker = () => {
  const [fontColor, setFontColor] = useState<string | undefined>('')
  const [CSSVariable, setCSSVariable] = useState<string | null>(null)

  // We'll work on those later...
  const handleOpenChange = () => {}
  const handleFontColorChange = (color: string, cssVariableColor?: string) => {
    if (cssVariableColor) setCSSVariable(cssVariableColor)
    else setCSSVariable(null)
    setFontColor(color)
  }

  const handleApplyStyles = () => {}

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger className="toolbar-popup__button toolbar-popup__button-bold">
        <FontColorIcon underscoreColor={fontColor} />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top">
        <ColorPicker
          onApplyStyles={handleApplyStyles}
          fontColor={fontColor}
          onFontColorChange={handleFontColorChange}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
