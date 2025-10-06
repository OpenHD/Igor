import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BUILD_INFO, BuildInfoEntry } from '../../build-info.generated';

interface FooterEntry {
  label: string;
  timestampText: string;
  relativeText: string | null;
  commitText: string | null;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  public frontendEntry: FooterEntry | null = null;
  public backendEntry: FooterEntry | null = null;
  public latestEntry: FooterEntry | null = null;

  private intervalId?: ReturnType<typeof setInterval>;

  ngOnInit(): void {
    this.updateEntries();
    this.intervalId = setInterval(() => this.updateEntries(), 60_000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateEntries(): void {
    this.frontendEntry = this.buildEntry('Frontend-Stand', BUILD_INFO.frontend);
    this.backendEntry = this.buildEntry('Backend-Stand', BUILD_INFO.backend);

    const latestTimestamp = this.pickLatestTimestamp([
      BUILD_INFO.frontend.buildTimestamp,
      BUILD_INFO.backend.buildTimestamp
    ]);

    if (latestTimestamp) {
      this.latestEntry = {
        label: 'Letzte Aktualisierung',
        timestampText: this.formatTimestamp(latestTimestamp),
        relativeText: this.formatRelativeTime(latestTimestamp),
        commitText: null
      };
    } else {
      this.latestEntry = null;
    }
  }

  private buildEntry(label: string, entry: BuildInfoEntry): FooterEntry | null {
    if (!entry.buildTimestamp && !entry.commit) {
      return null;
    }

    const timestampText = entry.buildTimestamp
      ? this.formatTimestamp(entry.buildTimestamp)
      : 'kein Zeitstempel verfügbar';

    return {
      label,
      timestampText,
      relativeText: entry.buildTimestamp ? this.formatRelativeTime(entry.buildTimestamp) : null,
      commitText: entry.commit ? `Commit ${this.shortenCommit(entry.commit)}` : null
    };
  }

  private pickLatestTimestamp(timestamps: Array<string | undefined>): string | null {
    const validDates = timestamps
      .filter((value): value is string => !!value)
      .map((value) => new Date(value))
      .filter((date) => !Number.isNaN(date.getTime()));

    if (validDates.length === 0) {
      return null;
    }

    const latestDate = validDates.reduce((latest, current) =>
      current.getTime() > latest.getTime() ? current : latest
    );

    return latestDate.toISOString();
  }

  private formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return 'unbekannt';
    }

    return new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  }

  private formatRelativeTime(timestamp: string): string | null {
    const date = new Date(timestamp);
    if (Number.isNaN(date.getTime())) {
      return null;
    }

    const diffMs = Date.now() - date.getTime();
    if (diffMs < 0) {
      return 'in der Zukunft';
    }

    const diffSeconds = Math.floor(diffMs / 1000);
    if (diffSeconds < 45) {
      return 'vor wenigen Sekunden';
    }

    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) {
      return `vor ${diffMinutes} ${diffMinutes === 1 ? 'Minute' : 'Minuten'}`;
    }

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
      return `vor ${diffHours} ${diffHours === 1 ? 'Stunde' : 'Stunden'}`;
    }

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) {
      return `vor ${diffDays} ${diffDays === 1 ? 'Tag' : 'Tagen'}`;
    }

    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 5) {
      return `vor ${diffWeeks} ${diffWeeks === 1 ? 'Woche' : 'Wochen'}`;
    }

    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) {
      return `vor ${diffMonths} ${diffMonths === 1 ? 'Monat' : 'Monaten'}`;
    }

    const diffYears = Math.floor(diffDays / 365);
    return `vor ${diffYears} ${diffYears === 1 ? 'Jahr' : 'Jahren'}`;
  }

  private shortenCommit(commit?: string): string {
    if (!commit) {
      return '';
    }
    return commit.substring(0, 7);
  }
}
