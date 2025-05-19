import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-feed',
  imports: [DatePipe],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent {
  posts = signal<any[]>([]);
  loading = signal(false);
  hasMore = signal(true);

  constructor(private http: HttpClient, private auth: AuthService) {
    this.loadMore();
  }

  private getLastPostId(): string | null {
    const list = this.posts();
    return list.length > 0 ? list[list.length - 1].id : null;
  }

  loadMore() {
    if (this.loading()) return;

    this.loading.set(true);
    const instanceUrl = this.auth.getInstanceUrl();
    let url = `${instanceUrl}/api/v1/timelines/public?local=true&limit=20`;

    const lastId = this.getLastPostId();
    if (lastId) url += `&max_id=${lastId}`;

    this.http.get<any[]>(url).subscribe({
      next: data => {
        if (data.length === 0) {
          this.hasMore.set(false);
        } else {
          this.posts.update(current => [...current, ...data]);
        }
        this.loading.set(false);
        console.log(data);
      },
      error: err => {
        console.error('Failed to fetch more posts:', err);
        this.loading.set(false);
      }
    });
  }
}