"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./page.module.css";
import type { AgentResponse, TopicCampaign } from "@/lib/agent";

type AgentState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; data: AgentResponse }
  | { status: "error"; message: string };

const formatDate = (timestamp: string) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp));

const useAgentData = () => {
  const [state, setState] = useState<AgentState>({ status: "idle" });

  const load = useCallback(async () => {
    setState({ status: "loading" });
    try {
      const response = await fetch("/api/agent", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        const message = await response
          .json()
          .then((body) => body.error ?? "Failed to generate agent plan")
          .catch(() => "Failed to generate agent plan");
        throw new Error(message);
      }

      const payload = (await response.json()) as AgentResponse;
      setState({ status: "ready", data: payload });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Agent generation failed.";
      setState({ status: "error", message });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { state, reload: load };
};

const PlatformCard = ({ campaign }: { campaign: TopicCampaign }) => (
  <details className={styles.topicCard}>
    <summary className={styles.topicSummary}>
      <div>
        <span className={styles.topicSource}>{campaign.topic.source}</span>
        <h3>{campaign.topic.title}</h3>
        <p>{campaign.topic.description}</p>
      </div>
      <div className={styles.topicMeta}>
        <span>Score: {campaign.topic.score}</span>
        <a href={campaign.topic.url} target="_blank" rel="noreferrer">
          Open source →
        </a>
      </div>
    </summary>
    <div className={styles.topicBody}>
      <div className={styles.topicHighlights}>
        <div>
          <h4>Positioning</h4>
          <p>{campaign.positioning}</p>
        </div>
        <div>
          <h4>Revenue Angle</h4>
          <p>{campaign.revenueAngle}</p>
        </div>
        <div>
          <h4>Keywords</h4>
          <p>
            {campaign.topic.keywords.length
              ? campaign.topic.keywords.join(", ")
              : "AI, automation, growth"}
          </p>
        </div>
      </div>
      <div className={styles.platformGrid}>
        {campaign.platformPlans.map((plan) => (
          <article key={plan.platformId} className={styles.platformCard}>
            <header>
              <h5>{plan.platformName}</h5>
              <p className={styles.platformKpi}>{plan.kpi}</p>
            </header>
            <p className={styles.platformHook}>{plan.hook}</p>
            <div className={styles.platformCopy}>
              <strong>Long-form narrative</strong>
              <pre>{plan.longFormCopy}</pre>
            </div>
            <div className={styles.platformCopy}>
              <strong>Short-form snippet</strong>
              <p>{plan.shortFormCopy}</p>
            </div>
            <div className={styles.platformFooter}>
              <span className={styles.hashtags}>
                {plan.hashtags.map((tag) => (
                  <code key={tag}>{tag}</code>
                ))}
              </span>
              <p className={styles.platformWindow}>{plan.postingWindow}</p>
              <div>
                <strong>Boosters</strong>
                <ul>
                  {plan.boosterActions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              </div>
              <div>
                <strong>Creative Brief</strong>
                <p>{plan.creativeBrief}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className={styles.topicFooter}>
        <strong>Repurposing Loops</strong>
        <ul>
          {campaign.repurposingIdeas.map((idea) => (
            <li key={idea}>{idea}</li>
          ))}
        </ul>
      </div>
    </div>
  </details>
);

export default function Home() {
  const { state, reload } = useAgentData();
  const readyData = useMemo(
    () => (state.status === "ready" ? state.data : null),
    [state]
  );

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div>
          <p className={styles.badge}>AI Monetization Command Center</p>
          <h1>
            Orchestrate zero-cost AI content sprints across every social
            platform.
          </h1>
          <p className={styles.subtitle}>
            This agent pulls the loudest AI conversations, builds platform-ready
            copy, and routes followers into a unified automation offer without
            paid tools. Target: 10M followers in 3–6 months.
          </p>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={reload}
              disabled={state.status === "loading"}
            >
              {state.status === "loading"
                ? "Calibrating..."
                : "Regenerate Growth Sprint"}
            </button>
            {readyData?.generatedAt && (
              <span className={styles.timestamp}>
                Synced {formatDate(readyData.generatedAt)}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {state.status === "error" && (
          <div className={styles.error}>
            <p>{state.message}</p>
            <button type="button" onClick={reload}>
              Retry
            </button>
          </div>
        )}

        {state.status === "loading" && (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Mapping trend graph…</p>
          </div>
        )}

        {readyData && (
          <>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Trending Signals & Campaigns</h2>
                <p>
                  Highest-velocity AI narratives merged from free intelligence
                  feeds. Expand a card to unlock cross-platform deployments.
                </p>
              </div>
              <div className={styles.topicList}>
                {readyData.topics.map((topic) => (
                  <PlatformCard key={topic.topic.id} campaign={topic} />
                ))}
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Automation Offer Blueprint</h2>
                <p>
                  Single destination to monetize attention with a zero-cost
                  automation implementation sprint.
                </p>
              </div>
              <article className={styles.blueprint}>
                <h3>{readyData.landingPage.headline}</h3>
                <p className={styles.subtitle}>
                  {readyData.landingPage.subheadline}
                </p>
                <div className={styles.blueprintGrid}>
                  <div>
                    <h4>Lead Magnet</h4>
                    <p>{readyData.landingPage.leadMagnet}</p>
                  </div>
                  <div>
                    <h4>Automation Stack</h4>
                    <ul>
                      {readyData.landingPage.automationStack.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4>Credibility Boosters</h4>
                    <ul>
                      {readyData.landingPage.credibilityBoosters.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4>Funnel Prompts</h4>
                    <ul>
                      {readyData.landingPage.funnelPrompts.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className={styles.blueprintSections}>
                  {readyData.landingPage.keySections.map((section) => (
                    <div key={section.title} className={styles.blueprintBlock}>
                      <h5>{section.title}</h5>
                      <ul>
                        {section.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Momentum Roadmap</h2>
                <p>
                  Layered growth system to compound reach and convert attention
                  into automation clients.
                </p>
              </div>
              <div className={styles.roadmap}>
                <div className={styles.roadmapColumn}>
                  <h4>Runway</h4>
                  <ol>
                    {readyData.runwayPlan.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                </div>
                <div className={styles.roadmapColumn}>
                  <h4>Community Flywheels</h4>
                  <ul>
                    {readyData.communityGrowthLoops.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
