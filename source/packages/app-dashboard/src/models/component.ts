interface HasChildren<TOutput> {
  children: (props: TOutput) => React.ReactNode
}

export type FaCC<TProps, TOutput> = React.FC<TProps & HasChildren<TOutput>>
