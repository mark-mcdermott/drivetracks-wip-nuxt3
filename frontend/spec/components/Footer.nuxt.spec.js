import { Footer } from '#components';
import { mountSuspended } from '@nuxt/test-utils/runtime';
import { expect, it } from "vitest";

it('can mount some component', async () => {
    const component = await mountSuspended(Footer)
    expect(component.text()).toMatchInlineSnapshot(
        '"© 2024. Made with Nuxt, Tailwind, UI Thing, Rails, Fly.io and S3."'
    )
})