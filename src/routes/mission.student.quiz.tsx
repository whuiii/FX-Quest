
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Sparkles,
  Star,
  Trophy,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Page,
  Panel,
  Pip,
  MissionProgress,
} from "@/components/quest-ui";

import { STUDENT_QUIZ, learningScore } from "@/lib/quiz";
import { setState, award } from "@/lib/game-store";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------
// Route configuration
// ---------------------------------------------------------

export const Route = createFileRoute("/mission/student/quiz")({
  head: () => ({
    meta: [
      {
        title: "Knowledge Check — The Tuition Deadline — FX Quest",
      },
      {
        name: "description",
        content:
          "Five quick questions on inflation, interest, FX direction and model limits.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:title",
        content: "Knowledge Check — FX Quest",
      },
      {
        property: "og:description",
        content: "Earn XP for understanding, not for luck.",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
  }),
  component: Quiz,
});

// ---------------------------------------------------------
// Quiz component
// ---------------------------------------------------------

function Quiz() {
  const nav = useNavigate();

  // Current question index.
  const [i, setI] = useState(0);

  // Selected answer for the current question.
  const [picked, setPicked] = useState<number | null>(null);

  // Number of attempts used for the current question.
  const [tries, setTries] = useState(0);

  // Earned points for each question.
  const [answers, setAnswers] = useState<Record<string, number>>({});

  // Prevent duplicate completion submissions.
  const [finishing, setFinishing] = useState(false);

  // Load the current question.
  const q = STUDENT_QUIZ[i];

  if (!q) return null;

  // Check whether the selected answer is correct.
  const correct = picked === q.answer;

  // Lock the question after a correct answer or two attempts.
  const locked = correct || tries >= 2;

  // Number of questions in the quiz.
  const totalQuestions = STUDENT_QUIZ.length;

  // Progress based on the current question.
  const progress = ((i + 1) / totalQuestions) * 100;

  // Current accumulated learning score.
  const currentScore = learningScore(answers);

  // -------------------------------------------------------
  // Answer selection
  // -------------------------------------------------------

  const pick = (option: number) => {
    if (locked || finishing) return;

    setPicked(option);

    const attempt = tries + 1;
    setTries(attempt);

    // First correct attempt = 20 points.
    // Second correct attempt = 10 points.
    if (option === q.answer) {
      setAnswers((previous) => ({
        ...previous,
        [q.id]: attempt === 1 ? 20 : 10,
      }));
    }
  };

  // -------------------------------------------------------
  // Continue to the next question or finish the quiz
  // -------------------------------------------------------

  const next = () => {
    if (!locked || finishing) return;

    // Move to the next question.
    if (i < totalQuestions - 1) {
      setI(i + 1);
      setPicked(null);
      setTries(0);
      return;
    }

    // Finish the quiz.
    setFinishing(true);

    const score = learningScore(answers);

    // Preserve the original quiz answer storage.
    setState((previous) => ({
      ...previous,
      quiz: {
        answers,
      },
    }));

    // Preserve XP, coins, badge and mission completion.
    award({
      xp: score,
      coins: Math.round(score / 2),
      badge: "currency-strategist",
      complete: "currency",
    });

    // Navigate to the existing Results page.
    nav({
      to: "/mission/student/results",
    });
  };

  // -------------------------------------------------------
  // Page layout
  // -------------------------------------------------------

  return (
    <Page wide>
      <div className="w-full min-w-0">

        {/* =================================================
            FULL-WIDTH MISSION HEADER
            Matches mission.student.play.tsx
        ================================================= */}

        <div className="relative mb-7 overflow-hidden rounded-[28px] border-2 border-white/80 bg-gradient-to-br from-sky-100 via-cyan-50 to-emerald-50 px-5 py-5 shadow-soft sm:px-7 sm:py-6 lg:mb-9 lg:rounded-[32px] lg:px-9 lg:py-7">

          {/* Decorative background */}
          <div className="pointer-events-none absolute -right-12 -top-20 h-64 w-64 rounded-full bg-sky-300/25 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-72 rounded-full bg-emerald-200/35 blur-3xl" />

          <div className="pointer-events-none absolute right-8 top-7 text-3xl opacity-60 sm:text-4xl">
            ✨
          </div>

          <div className="relative z-10">

            {/* Mission badges */}
            <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1.5">

              <span className="rounded-full border border-sky-200 bg-white/75 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-primary shadow-sm sm:px-4 sm:py-1.5 sm:text-xs">
                🗺️ Mission 01 · Stage 03
              </span>

              <span className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-extrabold text-amber-800 shadow-sm sm:text-xs">
                ⭐ Earn Learning Rewards
              </span>

            </div>

            {/* Header title */}
            <h1 className="max-w-4xl font-display text-[27px] font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-[38px]">
              🧠 The Knowledge Challenge
            </h1>

            {/* Header description */}
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-foreground/75 lg:text-[15px]">
              Test what you've learned about currencies,
              interest rates and inflation. Every correct
              answer brings you closer to victory!
            </p>

            {/* Shared Adventure Journey component */}
            <div className="mt-4 rounded-2xl border border-white/80 bg-white/65 px-3 py-3 shadow-sm backdrop-blur-sm sm:px-4 sm:py-3 [&_ol]:mb-0">

              <MissionProgress
                steps={[
                  "Briefing",
                  "Decide",
                  "Quiz",
                  "Results",
                ]}
                current={2}
              />

            </div>

          </div>
        </div>

        {/* =================================================
            DESKTOP TWO-COLUMN CONTENT
            Left: Quiz
            Right: Progress and scoring
        ================================================= */}

        <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(280px,0.28fr)] lg:gap-8 xl:gap-9">

          {/* ===============================================
              LEFT COLUMN — MAIN QUESTION PANEL
          =============================================== */}

          <Panel className="min-w-0 space-y-5 border-white/90 bg-white/95 p-5 shadow-lg shadow-sky-900/5 sm:p-6 lg:rounded-[32px] lg:p-7">

            {/* Question number and reward */}
            <div className="flex flex-wrap items-center justify-between gap-3">

              <span className="rounded-full bg-sky-100 px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-primary">
                Question {i + 1} of {totalQuestions}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-2 text-xs font-extrabold text-amber-700">
                <Star className="h-4 w-4" />

                {tries === 0
                  ? "Up to 20 pts"
                  : correct
                    ? `+${tries === 1 ? 20 : 10} pts`
                    : tries === 1
                      ? "10 pts available"
                      : "0 pts"}
              </span>

            </div>

            {/* Question progress */}
            <div>
              <div className="mb-2 flex items-center justify-between text-xs font-semibold text-muted-foreground">

                <span>Challenge Progress</span>

                <span>{Math.round(progress)}%</span>

              </div>

              <div
                className="h-2.5 overflow-hidden rounded-full bg-sky-100"
                role="progressbar"
                aria-label="Quiz question progress"
                aria-valuenow={i + 1}
                aria-valuemin={0}
                aria-valuemax={totalQuestions}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>

            {/* Actual question */}
            <div className="space-y-2">

              <p className="text-xs font-extrabold uppercase tracking-wider text-primary">
                {q.category}
              </p>

              <h2 className="font-display text-xl font-extrabold leading-snug text-foreground sm:text-2xl lg:text-[25px]">
                {q.q}
              </h2>

              <p className="text-xs text-muted-foreground">
                Choose the best answer. You have two attempts.
              </p>

            </div>

            {/* =============================================
                ANSWER OPTIONS
            ============================================= */}

            <div
              className="grid gap-3"
              role="group"
              aria-label="Answer options"
            >

              {q.options.map((option, k) => {

                const selected = picked === k;

                const isCorrectAnswer = k === q.answer;

                // Reveal the correct answer only after
                // the question has been completed.
                const showCorrect =
                  locked && isCorrectAnswer;

                const showWrong =
                  selected && !isCorrectAnswer;

                return (
                  <button
                    key={`${q.id}-${k}`}
                    type="button"
                    onClick={() => pick(k)}
                    disabled={locked || finishing}
                    aria-pressed={selected}
                    className={cn(
                      "group flex min-h-[64px] w-full items-center gap-3 rounded-[20px] border-2 px-4 py-3 text-left transition-all duration-200",

                      "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring",

                      !locked &&
                        "cursor-pointer hover:-translate-y-0.5 hover:border-primary/50 hover:bg-sky-50 hover:shadow-sm",

                      !selected &&
                        !showCorrect &&
                        "border-border bg-white",

                      showCorrect &&
                        "border-emerald-400 bg-emerald-50",

                      showWrong &&
                        "border-rose-300 bg-rose-50"
                    )}
                  >

                    {/* Answer letter */}
                    <span
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold",

                        showCorrect
                          ? "bg-emerald-200 text-emerald-800"
                          : showWrong
                            ? "bg-rose-200 text-rose-800"
                            : "bg-sky-100 text-primary"
                      )}
                    >
                      {String.fromCharCode(65 + k)}
                    </span>

                    {/* Answer text */}
                    <span className="min-w-0 flex-1 text-sm font-semibold leading-relaxed text-foreground sm:text-base">
                      {option}
                    </span>

                    {/* Correct indicator */}
                    {showCorrect && (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                    )}

                    {/* Incorrect indicator */}
                    {showWrong && (
                      <X className="h-5 w-5 shrink-0 text-rose-500" />
                    )}

                  </button>
                );
              })}

            </div>

            {/* =============================================
                PIP FEEDBACK
            ============================================= */}

            {picked !== null && (
              <div className="rounded-2xl bg-sky-50/50 p-3 sm:p-4">

                <Pip
                  mood={
                    correct
                      ? "celebrating"
                      : "concerned"
                  }
                  size={72}
                >

                  {correct ? (
                    <>
                      <b>
                        Correct! +{tries === 1 ? 20 : 10} pts.
                      </b>{" "}
                      {q.explain}
                    </>
                  ) : tries < 2 ? (
                    <>
                      Not quite — have another go! Hint:
                      think about which way the formula
                      pushes the number.
                    </>
                  ) : (
                    <>
                      <b>That one's tricky.</b>{" "}
                      {q.explain}
                    </>
                  )}

                </Pip>

              </div>
            )}

            {/* =============================================
                NEXT QUESTION / RESULTS BUTTON
            ============================================= */}

            <div className="border-t border-border pt-5">

              <Button
                variant="quest"
                size="lg"
                disabled={!locked || finishing}
                onClick={next}
                className="min-h-13 w-full rounded-2xl px-6 text-base font-extrabold sm:w-auto sm:min-w-[220px]"
              >

                {finishing
                  ? "Finishing..."
                  : i < totalQuestions - 1
                    ? "Next Question"
                    : "See My Results"}

                {!finishing && (
                  <ArrowRight className="ml-2 h-4 w-4" />
                )}

              </Button>

            </div>

          </Panel>

          {/* ===============================================
              RIGHT COLUMN — QUEST SIDEBAR
          =============================================== */}

          <aside className="hidden min-w-0 space-y-5 lg:block">

            {/* Quest progress card */}
            <Panel className="space-y-4 border-white/90 bg-white/95 p-5 shadow-lg shadow-sky-900/5 lg:rounded-[32px] lg:p-6">

              <div className="flex items-center gap-2">

                <Trophy className="h-5 w-5 text-amber-500" />

                <h3 className="font-display text-lg font-extrabold">
                  Quest Progress
                </h3>

              </div>

              {/* Earned points */}
              <div className="rounded-2xl bg-amber-50 p-4">

                <p className="text-xs font-bold text-amber-800">
                  Points Earned
                </p>

                <p className="mt-1 font-display text-3xl font-extrabold text-foreground">
                  {currentScore}
                </p>

                <p className="text-xs text-muted-foreground">
                  Up to {totalQuestions * 20} points
                </p>

              </div>

              {/* Individual question indicators */}
              <div className="grid grid-cols-5 gap-2">

                {STUDENT_QUIZ.map((question, index) => {

                  const done = index < i;

                  const active = index === i;

                  const earned =
                    answers[question.id] ?? 0;

                  return (
                    <div
                      key={question.id}
                      title={`Question ${index + 1}`}
                      className={cn(
                        "flex aspect-square items-center justify-center rounded-xl border text-xs font-extrabold",

                        active
                          ? "border-sky-400 bg-sky-100 text-primary"
                          : done && earned > 0
                            ? "border-emerald-300 bg-emerald-100 text-emerald-700"
                            : done
                              ? "border-border bg-muted text-muted-foreground"
                              : "border-border bg-white text-muted-foreground"
                      )}
                    >

                      {done ? (
                        earned > 0 ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <X className="h-4 w-4" />
                        )
                      ) : (
                        index + 1
                      )}

                    </div>
                  );
                })}

              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                Complete all five questions to finish
                your learning challenge.
              </p>

            </Panel>

            {/* Points guide */}
            <Panel className="space-y-4 border-white/90 bg-white/95 p-5 shadow-lg shadow-sky-900/5 lg:rounded-[32px] lg:p-6">

              <div className="flex items-center gap-2">

                <Sparkles className="h-5 w-5 text-primary" />

                <h3 className="font-display text-lg font-extrabold">
                  How to Earn Points
                </h3>

              </div>

              <div className="space-y-3">

                <div className="rounded-xl bg-emerald-50 p-3">
                  <p className="text-sm font-bold text-emerald-800">
                    🌟 First Correct Attempt
                  </p>

                  <p className="mt-1 text-xs text-emerald-700">
                    Earn 20 points
                  </p>
                </div>

                <div className="rounded-xl bg-sky-50 p-3">
                  <p className="text-sm font-bold text-sky-800">
                    ✨ Second Correct Attempt
                  </p>

                  <p className="mt-1 text-xs text-sky-700">
                    Earn 10 points
                  </p>
                </div>

                <div className="rounded-xl bg-rose-50 p-3">
                  <p className="text-sm font-bold text-rose-800">
                    🌱 Two Incorrect Attempts
                  </p>

                  <p className="mt-1 text-xs text-rose-700">
                    Earn 0 points
                  </p>
                </div>

              </div>

              <p className="border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
                Your score reflects financial understanding,
                not whether your exchange-rate prediction
                was lucky.
              </p>

            </Panel>

          </aside>

        </div>
      </div>
    </Page>
  );
}
