---
title: "Building My Personal Site: Astro, Cloudflare, and the $0 Tech Stack"
description: "How I built a production-ready personal website with email subscriptions and serverless APIs for free. Astro + Cloudflare Pages + Resend = the perfect stack for backend engineers."
pubDate: "Dec 24 2025"
---

As a backend engineer, I wanted a personal site that was fast, extensible, and didn't require me to become a frontend expert. After researching modern frameworks, I landed on a stack that checks all the boxes and costs nothing to run.

Here's what I built and why this stack is perfect for getting a site live quickly.

#### But first, the Why

I built this website using Astro, Cloudflare Pages, and Resend, a tech stack that cost me $0/month and took 6 hours to ship with Claude Code. But before diving into the "how," let me explain the "why."

I'm still brainstorming what structure my content on "Software Development and Leadership" should be. I'm also getting into the habit of putting something out quickly as a personal commitment to blog more! If you plan to stick around and read till the end, I promise you this will be a short one(-ish).

My approach to building software in general is understanding the "why" behind going after a decision, and try to lay out the tools out there that could help me keep things simple as I start out. I expand on my toolkit or build something from scratch as my needs expand. Software should be thought of in an iterative manner afterall (one of the future topics I would like to talk about).

Luckily, we live in a time where developer frameworks and tooling are so advanced that you end up with so many options and ways to get to the same end result. And so, the "how" behind the "why" becomes more about tradeoffs and how much you're willing to spend time to satisfy your requirements. For Backend engineers who don't enjoy Frontend work, I found that leveraging AI-assisted coding is a perfect use case for that, which I leveraged to build most of the functionality explained below the way I thought made sense (I also enjoy correcting AI coding assumptions).

I wanted this site to help me:

- Build personal brand and reach
- Create a space for my thoughts
- Share learnings with the community

With those goals in mind, here's how I chose each piece of the stack.

#### Astro for Backend Developers

As a software developer, I obsess over developer frameworks that are easy to use, well documented, have a strong community backing, offer optionality and genuinely care about system performance. Astro to me checked off all those items. I wanted something fun and simple to use to act as my baseline architecture, and have it be extended with functionality offered by other third-party solutions or by functionality I build myself.

On extending functionality, Astro offers multiple ways to run serverless functions (mainly dictated by your deployment provider adapter API), and you can choose which parts of your website is rendered statically while leveraging features such as API fetching for dynamic content, improving overall load times. This is the so-called `Islands Architecture` which is further explained by [Astro's official docs](https://docs.astro.build/en/concepts/islands/).

#### Resend Integration

The first CTA (Call-To-Action) I thought of providing is for visitors to subscribe to my mailing list. It's a simple form in a re-usable directive, written in plain HTML, CSS and JS. It allows a vistor to enter their email and click submit, the JS will verify the email input format before submitting the email.

I decided to use [Resend](https://resend.com/) for their easy-to-use API and generous free plan. They offer a simple API call to create an email contact, and they handle any deduplication needed in submissions, which is perfect for my use case.

Here's where it gets interesting, you want the form submitted to be processed by a serverless function as a `POST` request, and to have the input also be verified on the "backend" before saving the contact information on `Resend`.

You also need to keep in mind that `Resend` will provide an API Token that you should not, under any circumstance, commit to your source control (Git) or include in application logs for security reasons. So there is a need to only inject secrets when we interact with the `Resend` API.

#### Enter Cloudflare!

[Cloudlare](https://www.cloudflare.com/) offers different services with free tiers (yay!) for different needs. These are the ones I use with their free tier limits:

| Service              | Used For             | Free Tier              | Costs |
| -------------------- | -------------------- | ---------------------- | ----- |
| Cloudflare Pages     | Static hosting + CDN | Unlimited bandwidth    | $0    |
| Cloudflare Workers   | POST /api/subscribe  | 100K requests/day      | $0    |
| Cloudflare Turnstile | Bot protection       | 1M verifications/month | $0    |

`Cloudflare Pages` works seamlessly with Astro. You can connect your Github Repo and you can configure it to deploy the website whenever a selected branch is committed to. For the static portions of your website, it's totally free and your files are served from the CDN edge closest to the user, which is very fast!

`Cloudlfare Workers` is what is used to execute the `/api/subscribe` serverless function, and any secrets can be set as Environment Variables that the workers will use. By using the [Cloudflare official Astro adapter](https://docs.astro.build/en/guides/integrations-guide/cloudflare/), Astro can turn module exports as API Routes processed by CF workers.

`Cloudflare Turnstile` is used for verifications. It protects against attackers trying to submit emails that would deplete the `Resend` free limit of 3K emails/month and ensures authenticity. Turnstile requires its own API key, which similar to Resend, is loaded as a secret when Cloudflare workers process submissions.

- When a visitor clicks on Submit, Turnstile verification is invoked and only when it's successful that the `Resend` POST endpoint is called.
- The verification does not run for simply landing on the page which is an important point to call out.

#### Conclusion

I consider this to be a great foundation for what I'm looking to build as a start. It's simple and extremely extensible as `Resend` and `Cloudflare` offer many other useful services. It also proves that relying on well established frameworks and integrations alongside simplicity is always the right approach for simple projects or MVPs.

Building this foundation took me around 6 hours with the help of `Claude Code` for research, with most of my time spent manually moving my DNS records from Squarespace to Cloudflare, as well as learning how to use Cloudflare (navigating their dashboard was a challenge).

If I were to charge subscribers for content in the future, I would probably start off by integrating `Stripe` for payments as another serverless function, and only use another blogging platform such as `Substack` if my audience scales so much or if I'm seriously considering a stronger reach.

If you enjoyed reading this content, do subscribe for more in depth topics. Thanks for sticking around, and till next time!
