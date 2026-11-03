
/**
 * ==========================================================
 * FX QUEST — PIP AI CHAT WIDGET
 * ==========================================================
 *
 * This component connects the floating Pip button
 * with the Gemini-powered chat panel.
 *
 * Features:
 * - Opens and closes the AI chatbox
 * - Reads the player's selected game role
 * - Detects the current adventure screen
 * - Hides Pip on welcome / role-selection pages
 * - Preserves chat history across route navigation
 *
 * IMPORTANT:
 * This component does not modify:
 * - Game progress
 * - Mission calculations
 * - XP or coins
 * - Avatar customization
 * - Navigation behavior
 * ==========================================================
 */

import { useEffect, useState } from "react";

import { useLocation } from "@tanstack/react-router";

import { useGame } from "../../lib/game-store";

import PipChatButton from "./PipChatButton";
import PipChatPanel from "./PipChatPanel";

// ==========================================================
// TYPES
// ==========================================================

type PipRole =
  | "student"
  | "traveller"
  | "business"
  | null;

// ==========================================================
// ROLE NORMALIZATION
// ==========================================================

/**
 * Convert the existing game role into a role recognized
 * by PipChatPanel.
 *
 * Supports common variations of Business Owner role IDs.
 */
function normalizeRole(value: unknown): PipRole {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.toLowerCase().trim();

  if (normalized === "student") {
    return "student";
  }

  if (
    normalized === "traveller" ||
    normalized === "traveler"
  ) {
    return "traveller";
  }

  if (
    normalized === "business" ||
    normalized === "business-owner" ||
    normalized === "business_owner" ||
    normalized === "businessowner"
  ) {
    return "business";
  }

  return null;
}

// ==========================================================
// ROUTE VISIBILITY
// ==========================================================

/**
 * These are public / onboarding routes where Pip AI
 * should not appear.
 *
 * Update the paths if your application uses
 * different names for these screens.
 */
const HIDDEN_PATHS = new Set([
  "/",
  "/welcome",
  "/roles",
  "/role",
  "/select-role",
  "/role-selection",
  "/role-select",
  "/choose-role",
  "/onboarding",
]);

/**
 * Determine whether the current location is
 * an onboarding or adventure route.
 */
function isAdventureRoute(pathname: string): boolean {
  const normalizedPath =
    pathname.replace(/\/+$/, "") || "/";

  if (HIDDEN_PATHS.has(normalizedPath)) {
    return false;
  }

  return true;
}

// ==========================================================
// COMPONENT
// ==========================================================

export default function PipChatWidget() {
  // --------------------------------------------------------
  // GAME STATE AND ROUTE
  // --------------------------------------------------------

  const game = useGame();

  const location = useLocation();

  const pathname = location.pathname;

  // Convert the existing game role to Pip's context.
  const role = normalizeRole(game.role);

  // Only display Pip after a role is selected
  // and the player has entered the adventure.
  const shouldShow =
    role !== null &&
    isAdventureRoute(pathname);

  // --------------------------------------------------------
  // CHAT OPEN / CLOSE STATE
  // --------------------------------------------------------

  const [isOpen, setIsOpen] = useState(false);

  function toggleChat() {
    setIsOpen((previous) => !previous);
  }

  function closeChat() {
    setIsOpen(false);
  }

  // --------------------------------------------------------
  // CLOSE CHAT WHEN RETURNING TO ONBOARDING
  // --------------------------------------------------------

  useEffect(() => {
    if (!shouldShow) {
      setIsOpen(false);
    }
  }, [shouldShow]);

  // --------------------------------------------------------
  // CURRENT GAME CONTEXT
  // --------------------------------------------------------

  /**
   * Send the route path as lightweight screen context.
   *
   * Example:
   * /student/inflation
   *
   * The backend will use this only to help tailor
   * explanations. It does not use it to determine
   * mission answers or modify gameplay.
   */
  const currentMission =
    pathname.replace(/^\/+/, "").slice(0, 80);

  // --------------------------------------------------------
  // VISIBILITY
  // --------------------------------------------------------

  if (!shouldShow) {
    return null;
  }

  // ========================================================
  // RENDER FLOATING PIP + CHAT PANEL
  // ========================================================

  return (
    <>
      {/* Floating Pip mascot launcher */}
      <PipChatButton
        open={isOpen}
        onClick={toggleChat}
      />

      {/* Gemini-powered finance chat panel */}
      <PipChatPanel
        open={isOpen}
        onClose={closeChat}
        role={role}
        currentMission={currentMission}
      />
    </>
  );
}
