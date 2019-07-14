import React from 'react'

export interface AppProps {
  headingText?: string
}

export function App({ headingText }: AppProps): JSX.Element | null {
  if (headingText === undefined) {
    return null
  }

  return <h1>{headingText}</h1>
}
