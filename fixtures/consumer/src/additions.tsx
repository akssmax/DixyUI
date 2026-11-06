import { useState, createRef } from "react";
import {
  Button,
  ButtonGroup,
  AvatarGroup,
  Avatar,
  Card,
  Alert,
  Badge,
  Chip,
  Kbd,
  Textarea,
  NativeSelect,
  InputGroup,
  Link,
  Skeleton,
  Spinner,
  Empty,
  Breadcrumbs,
  Pagination,
  Command,
  ListBox,
  TagGroup,
  SearchField,
  DataTable,
  Table,
  Sidebar,
  Item,
  AspectRatio,
  Resizable,
  Carousel,
  Chart,
  ProgressCircle,
  ScrollShadow,
  Calendar,
  RangeCalendar,
  DateField,
  TimeField,
  DatePicker,
  DateRangePicker,
  ColorPicker,
  LocaleProvider,
  parseDate,
  parseColor,
  Time,
} from "@dixy-ui/react";
export function AdditionsConsumer() {
  const [date, setDate] = useState(parseDate("2026-10-15"));
  return (
    <LocaleProvider locale="en-US">
      <ButtonGroup size="sm">
        <Button>Save</Button>
      </ButtonGroup>
      <AvatarGroup.Root size="lg">
        <Avatar.Root>
          <Avatar.Fallback>AS</Avatar.Fallback>
        </Avatar.Root>
      </AvatarGroup.Root>
      <Card.Root as="a" href="#card" ref={createRef<HTMLAnchorElement>()}>
        <Card.Title as="h4">Title</Card.Title>
      </Card.Root>
      <Alert.Root />
      <Badge />
      <Chip />
      <Kbd />
      <Textarea />
      <NativeSelect />
      <InputGroup.Root />
      <Link href="/">Home</Link>
      <Skeleton />
      <Spinner />
      <Empty.Root />
      <Breadcrumbs.Root>
        <Breadcrumbs.Item>
          <Breadcrumbs.Link>Here</Breadcrumbs.Link>
        </Breadcrumbs.Item>
      </Breadcrumbs.Root>
      <Pagination.Root />
      <Command.Root<string> inline items={["one"]}>
        <Command.Input aria-label="Commands" />
        <Command.List>
          {(item) => (
            <Command.Item value={item} key={item}>
              {item}
            </Command.Item>
          )}
        </Command.List>
      </Command.Root>
      <ListBox.Root items={[{ id: 1, label: "One" }]} aria-label="Items">
        {(item) => <ListBox.Item id={item.id}>{item.label}</ListBox.Item>}
      </ListBox.Root>
      <TagGroup.Root>
        <TagGroup.Label>Tags</TagGroup.Label>
        <TagGroup.List>
          <TagGroup.Item id="one">One</TagGroup.Item>
        </TagGroup.List>
      </TagGroup.Root>
      <SearchField.Root>
        <SearchField.Label>Search</SearchField.Label>
        <SearchField.Input />
      </SearchField.Root>
      <DataTable.Root aria-label="Items">
        <DataTable.Header>
          <DataTable.Column isRowHeader>Item</DataTable.Column>
        </DataTable.Header>
        <DataTable.Body items={[{ id: 1, label: "One" }]}>
          {(item) => (
            <DataTable.Row id={item.id}>
              <DataTable.Cell>{item.label}</DataTable.Cell>
            </DataTable.Row>
          )}
        </DataTable.Body>
      </DataTable.Root>
      <Table.Root />
      <Sidebar.Root />
      <Item.Root />
      <AspectRatio ratio={4 / 3} />
      <Resizable.Root>
        <Resizable.Panel side="start" />
        <Resizable.Handle />
        <Resizable.Panel side="end" />
      </Resizable.Root>
      <Carousel.Root aria-label="Slides">
        <Carousel.Viewport>
          <Carousel.Item aria-label="Slide one">One</Carousel.Item>
        </Carousel.Viewport>
      </Carousel.Root>
      <Chart label="Values" data={[{ label: "One", value: 1 }]} />
      <ProgressCircle aria-label="Progress" value={30} />
      <ScrollShadow aria-label="Release notes" />
      <Calendar.Root
        aria-label="Date"
        value={date}
        onChange={(value) => {
          if (value) setDate(value);
        }}
      />
      <RangeCalendar.Root
        aria-label="Range"
        defaultValue={{ start: date, end: date.add({ days: 2 }) }}
      />
      <DateField.Root
        value={date}
        onChange={(value) => {
          if (value) setDate(value);
        }}
      >
        <DateField.Label>Date</DateField.Label>
        <DateField.Input>
          {(segment) => <DateField.Segment segment={segment} />}
        </DateField.Input>
      </DateField.Root>
      <TimeField.Root defaultValue={new Time(9, 30)} aria-label="Time" />
      <DatePicker.Root
        aria-label="Date"
        value={date}
        onChange={(value) => {
          if (value) setDate(value);
        }}
      />
      <DateRangePicker.Root aria-label="Dates" />
      <ColorPicker.Root defaultValue={parseColor("#7e4deb")}>
        <ColorPicker.Swatch />
      </ColorPicker.Root>
    </LocaleProvider>
  );
}

import type { AriaPopoverProps } from "@dixy-ui/react";
export const namedDatePopover: AriaPopoverProps = {
  "aria-label": "Choose a date",
};
