import type { ReactNode } from "react";
import { Card, Heading, Text } from "@dixy-ui/react";

/**
 * Fernpay layout molecules. Every view composes the same four pieces, so a
 * page header, card header, card footer and action area keep one structure,
 * one height and one alignment across views; switching views or changing data
 * never moves the chrome around it.
 */

/** Right-aligned action slot. Reserves one control height even when empty. */
export function Actions({ children }: { children?: ReactNode }) {
  return <div className="fp-actions">{children}</div>;
}

/** Page title, one-line description and the page's primary actions. */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="fp-page-header">
      <div className="fp-header-text">
        <Heading as="h1" variant="heading.md">
          {title}
        </Heading>
        <Text tone="muted" className="fp-one-line">
          {description}
        </Text>
      </div>
      <Actions>{actions}</Actions>
    </header>
  );
}

/** Card header: title, optional description, optional actions on the right. */
export function SectionHeader({
  title,
  description,
  actions,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <Card.Header className="fp-section-header">
      <div className="fp-header-text">
        <Card.Title>{title}</Card.Title>
        {description ? (
          <Card.Description className="fp-one-line">
            {description}
          </Card.Description>
        ) : null}
      </div>
      {actions ? <Actions>{actions}</Actions> : null}
    </Card.Header>
  );
}

/** Card footer: supporting text on the left, actions on the right, pinned to the bottom. */
export function SectionFooter({
  meta,
  actions,
}: {
  meta?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <Card.Footer className="fp-section-footer">
      <div className="fp-footer-meta">{meta}</div>
      <Actions>{actions}</Actions>
    </Card.Footer>
  );
}

/** Metric card: label, figure and a trend line, without a nested content box. */
export function StatCard({
  label,
  value,
  trend,
}: {
  label: ReactNode;
  value: ReactNode;
  trend: ReactNode;
}) {
  return (
    <Card.Root className="fp-section fp-stat">
      <Card.Header className="fp-stat-header">
        <Card.Description>{label}</Card.Description>
        <Card.Title className="fp-figure">{value}</Card.Title>
      </Card.Header>
      <Card.Footer className="fp-section-footer">{trend}</Card.Footer>
    </Card.Root>
  );
}
