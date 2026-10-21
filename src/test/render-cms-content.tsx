import { Children, cloneElement, isValidElement, type ReactNode } from "react";
import { CommunityGallery } from "@/components/sections/community-gallery";
import { InteractiveSteps } from "@/components/sections/interactive-steps";
import { LazyVideo } from "@/components/ui/lazy-video";
import { ZoomableImage } from "@/components/ui/zoomable-image";
import { render } from "@/test/render";

const clientComponents: unknown[] = [CommunityGallery, InteractiveSteps, LazyVideo, ZoomableImage];

// Resolve the server-only content tree while leaving interactive leaves to React.
async function resolveContent(node: ReactNode): Promise<ReactNode> {
  if (Array.isArray(node)) return Promise.all(node.map(resolveContent));
  if (!isValidElement<{ children?: ReactNode }>(node)) return node;
  if (typeof node.type === "function" && !clientComponents.includes(node.type)) {
    const Component = node.type as (props: unknown) => ReactNode | Promise<ReactNode>;
    return resolveContent(await Component(node.props));
  }
  if (node.props.children === undefined) return node;
  const children = await Promise.all(Children.toArray(node.props.children).map(resolveContent));
  return cloneElement(node, {}, ...children);
}

export async function renderCmsContent(node: ReactNode) {
  return render(await resolveContent(node));
}
