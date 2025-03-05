type BtnProps = {
  variableName: string
  variable: string
  onFontColorChange: (color: string, cssVariableColor: string) => void
  colorSpectrum: ColorSpectrum
}

const ThemeColorButton = ({
  variableName,
  variable,
  onFontColorChange,
  colorSpectrum,
}: BtnProps) => {
  const colorRef = useRef(null)
  const [backgroundColor, setBackgroundColor] = React.useState<string | undefined>(undefined)

  const getTranslateSpectrum = (
    colorSpectrum: ColorSpectrum,
  ): 'HEX' | 'RGBstring' | 'HSLstring' => {
    switch (colorSpectrum) {
      case 'hex':
        return 'HEX'
      case 'hsl':
        return 'HSLstring'
      case 'rgb':
        return 'RGBstring'
      default:
        return 'HEX'
    }
  }

  // We set the background-color each time the color spectrum changes
  useEffect(() => {
    if (colorRef.current) {
      const computedStyle = getComputedStyle(colorRef.current)
      setBackgroundColor(
        translateColor(computedStyle.backgroundColor, getTranslateSpectrum(colorSpectrum), 0),
      )
    }
  }, [colorSpectrum])

  return (
    <button
      key={variableName}
      onClick={() => {
        if (!backgroundColor) return
        onFontColorChange(translateColor(backgroundColor, 'HEX'), `hsl(var(${variable}))`)
      }}
      className="border-none outiline-none flex gap-2 items-center cursor-pointer p-1 rounded-md bg-[var(--theme-elevation-0)] hover:bg-[var(--theme-elevation-50)]"
    >
      <div className="flex items-center w-full gap-2">
        <div
          style={{ backgroundColor: `hsl(var(${variable}))` }}
          ref={colorRef}
          className={`h-9 w-9 rounded-full border-white border-[1px] border-solid`}
        ></div>
        <div className="leading-none">{createSentenceFromCamelCase(variableName, 15)}</div>
      </div>
      <div className="leading-none whitespace-nowrap bg-[var(--theme-elevation-150)] mr-2 p-2 rounded-sm">
        {backgroundColor}
      </div>
    </button>
  )
}
