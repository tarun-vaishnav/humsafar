import { Link } from 'react-router-dom'
import { Section, Container, Heading, Text } from '@components/ui'

export default function NotFoundPage() {
  return (
    <Section spacing="hero">
      <Container>
        <Heading level={1}>404 — off the map</Heading>
        <Text className="mt-4 text-content-secondary">
          This route doesn’t exist yet. Every great trip includes a wrong turn.
        </Text>
        <Link
          to="/"
          className="mt-8 inline-block text-brand-500 underline underline-offset-4 hover:text-brand-400"
        >
          Return to the beginning
        </Link>
      </Container>
    </Section>
  )
}
