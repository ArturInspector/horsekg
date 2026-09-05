"use client";

import { KeyRound, RefreshCw } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { analyticsSummaryEndpoint } from "../../../lib/analytics";

type FunnelItem = {
  key: string;
  label: string;
  count: number;
  note: string;
};

type SummaryRow = {
  key: string;
  name: string;
  visits: number;
  telegramClicks: number;
  botStarts: number;
  leads: number;
  bookings: number;
  clickRate: number;
  leadRate: number;
  bookingRate: number;
};

type AnalyticsSummary = {
  from: string;
  to: string;
  totals: {
    visits: number;
    telegramClicks: number;
    botStarts: number;
    leads: number;
    bookings: number;
    clickRate: number;
    leadRate: number;
    bookingRate: number;
  };
  funnel: FunnelItem[];
  sources: SummaryRow[];
  campaigns: SummaryRow[];
  buttons: SummaryRow[];
};

const tokenStorageKey = "horsesharing.analytics.adminToken";

function inputDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function defaultFromDate() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return inputDate(date);
}

function todayDate() {
  return inputDate(new Date());
}

function percent(value: number) {
  return `${value.toLocaleString("ru-RU", { maximumFractionDigits: 1 })}%`;
}

function formatNumber(value: number) {
  return value.toLocaleString("ru-RU");
}

function maxFunnelCount(items: FunnelItem[]) {
  return Math.max(1, ...items.map((item) => item.count));
}

function EmptyRows() {
  return (
    <p className="adminEmpty">
      Пока нет данных за выбранный период. После рекламы здесь появятся источники,
      кнопки, заявки и брони.
    </p>
  );
}

function SummaryTable({
  rows,
  title,
  firstColumn
}: {
  rows: SummaryRow[];
  title: string;
  firstColumn: string;
}) {
  return (
    <section className="adminPanel" aria-labelledby={`${title}-title`}>
      <h2 id={`${title}-title`}>{title}</h2>
      {rows.length === 0 ? (
        <EmptyRows />
      ) : (
        <div className="adminTableWrap">
          <table className="adminTable">
            <thead>
              <tr>
                <th>{firstColumn}</th>
                <th>Сайт</th>
                <th>Telegram</th>
                <th>Заявки</th>
                <th>Брони</th>
                <th>Заявка из Telegram</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key}>
                  <td>
                    <strong>{row.name}</strong>
                    <span>{row.key}</span>
                  </td>
                  <td>{formatNumber(row.visits)}</td>
                  <td>{formatNumber(row.telegramClicks)}</td>
                  <td>{formatNumber(row.leads)}</td>
                  <td>{formatNumber(row.bookings)}</td>
                  <td>{percent(row.leadRate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export function AnalyticsAdmin() {
  const [token, setToken] = useState("");
  const [from, setFrom] = useState(defaultFromDate);
  const [to, setTo] = useState(todayDate);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedToken = window.localStorage.getItem(tokenStorageKey);

    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  async function loadSummary(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const url = new URL(analyticsSummaryEndpoint());
      url.searchParams.set("from", from);
      url.searchParams.set("to", to);

      const response = await fetch(url, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`
            }
          : undefined
      });

      if (response.status === 401) {
        setError("Токен отчета не подошел. Проверь значение в Railway.");
        return;
      }

      if (!response.ok) {
        setError("Не удалось загрузить отчет. Попробуй обновить страницу.");
        return;
      }

      const data = (await response.json()) as AnalyticsSummary;
      setSummary(data);

      if (token) {
        window.localStorage.setItem(tokenStorageKey, token);
      }
    } catch {
      setError("API отчета сейчас не отвечает.");
    } finally {
      setIsLoading(false);
    }
  }

  const maxCount = summary ? maxFunnelCount(summary.funnel) : 1;

  return (
    <main className="adminPage">
      <header className="adminHeader">
        <div>
          <p className="eyebrow">Отчет</p>
          <h1>Заявки и брони</h1>
          <p>
            Заявка здесь означает, что человек оставил телефон. Бронь означает,
            что заявка создана в системе.
          </p>
        </div>
      </header>

      <section className="adminPanel">
        <form className="adminFilters" onSubmit={loadSummary}>
          <label>
            <span>Токен отчета</span>
            <input
              autoComplete="off"
              onChange={(event) => setToken(event.target.value)}
              placeholder="Вставь токен из Railway"
              type="password"
              value={token}
            />
          </label>
          <label>
            <span>С</span>
            <input
              onChange={(event) => setFrom(event.target.value)}
              type="date"
              value={from}
            />
          </label>
          <label>
            <span>По</span>
            <input
              onChange={(event) => setTo(event.target.value)}
              type="date"
              value={to}
            />
          </label>
          <button className="button dark" disabled={isLoading} type="submit">
            {isLoading ? <RefreshCw size={18} /> : <KeyRound size={18} />}
            {isLoading ? "Загружаю" : "Показать отчет"}
          </button>
        </form>
        {error ? <p className="adminError">{error}</p> : null}
      </section>

      {summary ? (
        <>
          <section className="adminStats" aria-label="Главные цифры">
            <div>
              <span>Посещения сайта</span>
              <strong>{formatNumber(summary.totals.visits)}</strong>
            </div>
            <div>
              <span>Нажали Telegram</span>
              <strong>{formatNumber(summary.totals.telegramClicks)}</strong>
            </div>
            <div>
              <span>Оставили телефон</span>
              <strong>{formatNumber(summary.totals.leads)}</strong>
            </div>
            <div>
              <span>Создали бронь</span>
              <strong>{formatNumber(summary.totals.bookings)}</strong>
            </div>
          </section>

          <section className="adminPanel" aria-labelledby="funnel-title">
            <div className="adminPanelHeader">
              <h2 id="funnel-title">Путь клиента</h2>
              <p>
                Смотрим, на каком шаге люди теряются: сайт, Telegram, телефон,
                бронь.
              </p>
            </div>
            <div className="funnelList">
              {summary.funnel.map((item) => (
                <div className="funnelRow" key={item.key}>
                  <div>
                    <strong>{item.label}</strong>
                    <span>{item.note}</span>
                  </div>
                  <div className="funnelBar">
                    <span
                      style={{
                        width: `${Math.max(4, (item.count / maxCount) * 100)}%`
                      }}
                    />
                  </div>
                  <b>{formatNumber(item.count)}</b>
                </div>
              ))}
            </div>
          </section>

          <SummaryTable
            firstColumn="Откуда пришли"
            rows={summary.sources}
            title="Источники"
          />
          <SummaryTable
            firstColumn="Кампания"
            rows={summary.campaigns}
            title="Кампании"
          />
          <SummaryTable
            firstColumn="Кнопка"
            rows={summary.buttons}
            title="Какие кнопки нажимают"
          />
        </>
      ) : (
        <section className="adminPanel">
          <p className="adminEmpty">
            Вставь токен отчета и нажми “Показать отчет”. Данные берутся из
            сайта, Telegram-бота и броней.
          </p>
        </section>
      )}
    </main>
  );
}
