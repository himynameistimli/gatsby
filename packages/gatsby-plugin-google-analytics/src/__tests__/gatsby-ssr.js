import { onRenderBody } from "../gatsby-ssr"

describe(`gatsby-plugin-google-analytics`, () => {
  describe(`gatsby-ssr`, () => {
    describe(`onRenderBody`, () => {
      describe(`in non-production env`, () => {
        it(`does not set tracking script`, () => {
          const setHeadComponents = jest.fn()

          onRenderBody({ setHeadComponents })

          expect(setHeadComponents).not.toHaveBeenCalled()
        })
      })

      describe(`in production env`, () => {
        let env

        beforeAll(() => {
          env = process.env.NODE_ENV
          process.env.NODE_ENV = `production`
        })

        afterAll(() => {
          process.env.NODE_ENV = env
        })

        const setup = options => {
          const setHeadComponents = jest.fn()
          const setPostBodyComponents = jest.fn()

          options = Object.assign({}, options)

          onRenderBody({ setHeadComponents, setPostBodyComponents }, options)

          return {
            setHeadComponents,
            setPostBodyComponents,
          }
        }

        it(`sets tracking script`, () => {
          const { setHeadComponents, setPostBodyComponents } = setup()

          expect(setHeadComponents).toHaveBeenCalledTimes(1)
          expect(setPostBodyComponents).toHaveBeenCalledTimes(1)
        })

        it(`sets tracking script in head`, () => {
          const { setHeadComponents, setPostBodyComponents } = setup({
            head: true,
          })

          expect(setHeadComponents).toHaveBeenCalledTimes(2)
          expect(setPostBodyComponents).not.toHaveBeenCalled()
        })

        it(`sets trackingId`, () => {
          const { setPostBodyComponents } = setup({
            trackingId: `TEST_TRACKING_ID`,
          })

          const result = JSON.stringify(setPostBodyComponents.mock.calls[0][0])

          expect(result).toMatch(/TEST_TRACKING_ID/)
        })

        it(`sets anonymize`, () => {
          const { setPostBodyComponents } = setup({
            anonymize: true,
          })

          const result = JSON.stringify(setPostBodyComponents.mock.calls[0][0])

          expect(result).toMatch(/anonymizeIp/)
        })

        it(`sets respectDNT`, () => {
          const { setPostBodyComponents } = setup({
            respectDNT: true,
          })

          const result = JSON.stringify(setPostBodyComponents.mock.calls[0][0])

          expect(result).toMatch(/doNotTrack/)
        })

        it(`sets excluded paths`, () => {
          const { setPostBodyComponents } = setup({
            exclude: [`/some-path`],
          })

          const result = JSON.stringify(setPostBodyComponents.mock.calls[0][0])

          expect(result).toMatch(/excludeGAPaths/)
        })

        it(`sets optimizeId`, () => {
          const { setPostBodyComponents } = setup({
            optimizeId: `TEST_OPTIMIZE_ID`,
          })

          const result = JSON.stringify(setPostBodyComponents.mock.calls[0][0])

          expect(result).toMatch(/TEST_OPTIMIZE_ID/)
        })

        it(`sets experimentId`, () => {
          const { setPostBodyComponents } = setup({
            optimizeId: `TEST_EXPERIMENT_ID`,
          })

          const result = JSON.stringify(setPostBodyComponents.mock.calls[0][0])

          expect(result).toMatch(/TEST_EXPERIMENT_ID/)
        })

        it(`sets variationId`, () => {
          const { setPostBodyComponents } = setup({
            optimizeId: `TEST_VARIATION_ID`,
          })

          const result = JSON.stringify(setPostBodyComponents.mock.calls[0][0])

          expect(result).toMatch(/TEST_VARIATION_ID/)
        })

        it(`sets additional create only fields`, () => {
          const { setPostBodyComponents } = setup({
            cookieName: `COOKIE_NAME`,
            sampleRate: 5,
          })

          const result = JSON.stringify(setPostBodyComponents.mock.calls[0][0])

          expect(result).toMatch(/cookieName/)
          expect(result).toMatch(/sampleRate/)
        })
      })
    })
  })
})
