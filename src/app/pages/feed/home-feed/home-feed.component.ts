import { Component, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../../services/auth.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home-feed',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './home-feed.component.html',
  styleUrl: './home-feed.component.scss'
})
export class HomeFeedComponent {
  endpointUrl = "/api/v1/timelines/home?limit=20";
  
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
    let url = instanceUrl + this.endpointUrl;

    const lastId = this.getLastPostId();
    if (lastId) url += `&max_id=${lastId}`;

    this.http.get<any[]>(url, {
      headers: {
        Authorization: `Bearer ${this.auth.getToken()!}` // pray it finds one
      }
    }).subscribe({
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
