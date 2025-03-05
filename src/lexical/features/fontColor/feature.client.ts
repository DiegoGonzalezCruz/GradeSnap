// feature.client.ts
'use client'

import {
  createClientFeature,
  toolbarFeatureButtonsGroupWithItems,
} from '@payloadcms/richtext-lexical/client'
import { DropdownColorPicker } from './components/DropdownColorPicker'

// Not defined yet...

export const FontColorFeatureClient = createClientFeature({
  toolbarFixed: {
    groups: [
      toolbarFeatureButtonsGroupWithItems([
        {
          key: 'fontColor',
          label: 'Color Text',
          Component: DropdownColorPicker,
        },
      ]),
    ],
  },
})
