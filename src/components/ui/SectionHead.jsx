import Reveal from './Reveal'

export default function SectionHead({ index, eyebrow, title, subtitle }) {
  return (
    <Reveal as="header" className="p-head">
      <span className="p-head__index" aria-hidden="true">{index}</span>
      <p className="p-head__eyebrow">{eyebrow}</p>
      <h2 className="p-head__title">{title}</h2>
      {subtitle ? <p className="p-head__sub">{subtitle}</p> : null}
    </Reveal>
  )
}
