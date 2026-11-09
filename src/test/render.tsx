import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { render as renderClient, type RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, vi } from "vitest";
import messages from "../../messages/en.json";

const router = vi.hoisted(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
}));

export { router };

vi.mock("next/navigation", async (importOriginal) => ({
  ...await importOriginal<typeof import("next/navigation")>(),
  usePathname: () => "/en",
  useRouter: () => router,
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({ locale: "en" }),
}));

beforeEach(() => {
  for (const method of Object.values(router)) method.mockClear();
});

export function render(ui: ReactNode, options?: Omit<RenderOptions, "wrapper">) {
  return renderClient(ui, {
    ...options,
    wrapper: ({ children }) => (
      <NextIntlClientProvider locale="en" messages={messages} timeZone="Asia/Phnom_Penh">
        {children}
      </NextIntlClientProvider>
    ),
  });
}

type ServerComponent = (props: never) => ReactNode | Promise<ReactNode>;

// Resolve only explicitly listed server components; client hooks stay with React.
async function resolveServerTree(node: ReactNode, components: ServerComponent[]): Promise<ReactNode> {
  if (Array.isArray(node)) {
    return Promise.all(node.map((child) => resolveServerTree(child, components)));
  }
  if (!isValidElement<{ children?: ReactNode }>(node)) return node;
  if (typeof node.type === "function" && components.includes(node.type as ServerComponent)) {
    const Component = node.type as (props: unknown) => ReactNode | Promise<ReactNode>;
    return resolveServerTree(await Component(node.props), components);
  }
  if (node.props.children === undefined) return node;
  const children = await Promise.all(
    Children.toArray(node.props.children).map((child) => resolveServerTree(child, components)),
  );
  return cloneElement(node, {}, ...children);
}

export async function renderServer(ui: ReactElement, components: ServerComponent[]) {
  return render(await resolveServerTree(ui, components));
}
