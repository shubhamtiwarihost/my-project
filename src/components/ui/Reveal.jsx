import { useInView } from '../../hooks/useInView'

/** Swings its content up into place the first time it scrolls into view. */
export default function Reveal({ as: Tag = 'div', className = '', delay = 0, children, ...rest }) {
  const [ref, visible] = useInView({ threshold: 0.1 })
  return (
    <Tag
      ref={ref}
      className={`rv${visible ? ' is-in' : ''} ${className}`}
      style={delay ? { '--d': `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}
