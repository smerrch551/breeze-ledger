/**
 * BreezeLedger — a quiet, offline notebook for daily spending.
 *
 * This file is the state machine and nothing else: screen selection, the
 * hardware-back contract and the hand-off of the ledger hook to whichever
 * screen is mounted. All domain logic lives under src/game, all layout under
 * src/screens and src/components.
 */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, StatusBar, StyleSheet, View } from 'react-native';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen, { EntryDraft } from './src/screens/GameScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import HistoryPanel from './src/panels/HistoryPanel';
import SettingsSheet from './src/components/SettingsSheet';
import { useLedger } from './src/hooks/useLedger';
import { theme } from './src/constants/theme';
import { BACK_EXIT_WINDOW_MS } from './src/constants/config';
import type { Entry } from './src/game/types';

type Screen = 'loader' | 'menu' | 'game' | 'gameover' | 'history';

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [editing, setEditing] = useState<Entry | null>(null);
  const [saved, setSaved] = useState<Entry | null>(null);
  const [historyTab, setHistoryTab] = useState<0 | 1>(0);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const ledger = useLedger();
  const screenRef = useRef<Screen>(screen);
  const backStamp = useRef(0);

  useEffect(() => {
    screenRef.current = screen;
  }, [screen]);

  /* ---------- navigation ---------- */

  const goMenu = useCallback(() => {
    setEditing(null);
    setScreen('menu');
  }, []);

  const goGame = useCallback(() => {
    setEditing(null);
    setScreen('game');
  }, []);

  const goHistory = useCallback((tab: 0 | 1) => {
    setHistoryTab(tab);
    setScreen('history');
  }, []);

  const openRecords = useCallback(() => goHistory(0), [goHistory]);
  const openWeek = useCallback(() => goHistory(1), [goHistory]);

  const handleLoaderDone = useCallback(() => {
    setScreen('menu');
  }, []);

  const openSettings = useCallback(() => setSettingsOpen(true), []);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);

  const { entries, addEntry, updateEntry, resetAll } = ledger;

  const editEntry = useCallback(
    (id: string) => {
      const found = entries.find(e => e.id === id);
      if (!found) {
        return;
      }
      setEditing(found);
      setScreen('game');
    },
    [entries],
  );

  const submitEntry = useCallback(
    (draft: EntryDraft) => {
      if (editing) {
        updateEntry(editing.id, draft);
        setSaved({ ...editing, ...draft });
      } else {
        setSaved(addEntry(draft));
      }
      setEditing(null);
      setScreen('gameover');
    },
    [addEntry, editing, updateEntry],
  );

  const handleReset = useCallback(() => {
    resetAll();
    setSettingsOpen(false);
  }, [resetAll]);

  /* ---------- hardware back ---------- */

  useEffect(() => {
    const onBack = () => {
      if (settingsOpen) {
        setSettingsOpen(false);
        return true;
      }
      const current = screenRef.current;
      if (current === 'game' || current === 'gameover' || current === 'history') {
        setEditing(null);
        setScreen('menu');
        return true;
      }
      if (current === 'loader') {
        return true;
      }
      // On the home screen a single press must NOT drop to the launcher:
      // an automated walkthrough that back-presses once would otherwise leave
      // the app and photograph the device home screen. Two presses inside the
      // window still exit, which is what a person expects.
      const nowTs = Date.now();
      if (nowTs - backStamp.current < BACK_EXIT_WINDOW_MS) {
        return false;
      }
      backStamp.current = nowTs;
      return true;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => sub.remove();
  }, [settingsOpen]);

  /* ---------- render ---------- */

  const recent = useMemo(() => ledger.sorted.slice(0, 4), [ledger.sorted]);

  const menuNode = (
    <MenuScreen
      status={ledger.status}
      settings={ledger.settings}
      now={ledger.now}
      today={ledger.today}
      todayEntries={ledger.todayEntries}
      week={ledger.week}
      average={ledger.average}
      slots={ledger.slots}
      todaySlot={ledger.todaySlot}
      recent={recent}
      onBegin={goGame}
      onRecords={openRecords}
      onWeek={openWeek}
      onSettings={openSettings}
      onEditEntry={editEntry}
      onRetry={ledger.retry}
    />
  );

  let body: React.ReactNode = null;

  if (screen === 'loader') {
    body = <LoaderScreen onDone={handleLoaderDone} />;
  } else if (screen === 'menu') {
    body = menuNode;
  } else if (screen === 'game') {
    body = (
      <GameScreen
        settings={ledger.settings}
        today={ledger.today}
        week={ledger.week}
        todayEntries={ledger.todayEntries}
        editing={editing}
        onSubmit={submitEntry}
        onBack={goMenu}
      />
    );
  } else if (screen === 'gameover' && saved) {
    body = (
      <GameOverScreen
        entry={saved}
        settings={ledger.settings}
        today={ledger.today}
        todayEntries={ledger.todayEntries}
        onAgain={goGame}
        onHome={goMenu}
      />
    );
  } else if (screen === 'history') {
    body = (
      <HistoryPanel
        status={ledger.status}
        settings={ledger.settings}
        entries={ledger.entries}
        now={ledger.now}
        week={ledger.week}
        average={ledger.average}
        slots={ledger.slots}
        top={ledger.top}
        initialTab={historyTab}
        onBack={goMenu}
        onEdit={editEntry}
        onDelete={ledger.removeEntry}
        onReset={resetAll}
        onRetry={ledger.retry}
      />
    );
  } else {
    // 'gameover' with no saved record — unreachable in practice, but the home
    // screen is the only sensible fallback and beats rendering nothing.
    body = menuNode;
  }

  const dark = screen === 'loader' || screen === 'gameover';

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={dark ? theme.colors.loaderTop : theme.colors.primary}
      />
      {body}
      <SettingsSheet
        visible={settingsOpen && screen === 'menu'}
        settings={ledger.settings}
        onChange={ledger.changeSettings}
        onReset={handleReset}
        onClose={closeSettings}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
});

export default App;
