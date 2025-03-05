import React, { useEffect, useRef, useState } from 'react'

// We import our colors.ts file here

import { createSentenceFromCamelCase } from '@payload/lexical/features/fontColorFeature/utils/createSentenceFromCamelCase'
import { Label } from '@@/shared/ui/label'

// used to transform the color in HEX
import { translateColor } from '../../utils/translateColor'
import { ScrollArea } from '@/components/ui/scroll-area'
import { appTheme } from '../utils/colors'

type Props = {
  onFontColorChange: (color: string) => void
}

export const ThemeColorsView = ({
  onFontColorChange,
  onColorSpectrumChange,
  colorSpectrum,
}: Props) => {
  return (
    <div>
      <RadioGroupList value={colorSpectrum} onValueChange={onColorSpectrumChange} />
      <Separator className="my-2" />
      <ScrollArea className="h-[265px] overflow-auto">
        <div className="flex flex-col gap-2">
          {Object.entries(appTheme).map(([key, variable]) => {
            return (
              <ThemeColorButton
                colorSpectrum={colorSpectrum}
                variableName={key}
                key={key}
                onFontColorChange={onFontColorChange}
                variable={variable}
              />
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
