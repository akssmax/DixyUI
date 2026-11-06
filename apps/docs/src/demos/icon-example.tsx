import { Heart } from "lucide-react";
import { HeartIcon } from "@phosphor-icons/react/dist/ssr/Heart";
import { Icon, Text, type IconProps } from "@dixy-ui/react";

interface IconExampleProps extends Pick<IconProps, "size" | "color"> {
  pack?: "lucide" | "phosphor";
  named?: boolean;
}

export default function IconExample({
  pack = "lucide",
  size = "lg",
  color = "primary",
  named = false,
}: IconExampleProps) {
  return (
    <div className="icon-example">
      <Icon
        render={
          pack === "phosphor" ? <HeartIcon weight="duotone" /> : <Heart />
        }
        size={size}
        color={color}
        label={named ? "Favorite" : undefined}
      />
      <Text variant="body.sm" tone="muted">
        {pack === "phosphor" ? "Phosphor · duotone" : "Lucide · outline"}
        {named ? " · named image" : " · decorative"}
      </Text>
    </div>
  );
}
