import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://api.github.com/repos/BytewithMahi/Swasthya/commits', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Swasthya-App'
      },
      next: { revalidate: 120 } // Cache for 2 minutes
    });

    if (!res.ok) {
      throw new Error(`GitHub API returned status ${res.status}`);
    }

    const commits = await res.json();
    if (!Array.isArray(commits)) {
      throw new Error('Invalid commits response from GitHub');
    }

    // Filter commits that are merges (parents.length > 1)
    let merges = commits.filter((c: any) => c.parents && c.parents.length > 1);

    // If we have fewer than 3 merges, let's append recent commits to populate the list (fallback)
    if (merges.length < 3) {
      const extraCommits = commits.filter((c: any) => !merges.some((m: any) => m.sha === c.sha));
      merges = [...merges, ...extraCommits].slice(0, 3);
    }

    const data = merges.slice(0, 3).map((m: any) => ({
      username: m.author?.login || m.commit?.author?.name || 'Anonymous',
      hash: m.sha.substring(0, 7),
      timestamp: m.commit?.author?.date || new Date().toISOString(),
      message: m.commit?.message?.split('\n')[0] || '',
      url: m.html_url
    }));

    return NextResponse.json({ success: true, merges: data });
  } catch (error: any) {
    console.error('Fetch merges error:', error);
    // Return high quality fallback mock data if Github API fails (e.g. rate limits or offline)
    const fallbacks = [
      {
        username: 'BytewithMahi',
        hash: '609b73a',
        timestamp: '2026-07-05T12:21:20Z',
        message: 'Merge pull request #1 from BytewithMahi/ruyam-branch',
        url: 'https://github.com/BytewithMahi/Swasthya/commit/609b73a0b2a6868c7fd1801ba322a3ee522f5d86'
      },
      {
        username: 'ruyamB',
        hash: '6d702dd',
        timestamp: '2026-07-05T12:15:27Z',
        message: 'Added features branch and modules configuration',
        url: 'https://github.com/BytewithMahi/Swasthya/commit/6d702dd1230f73d5ca7159a042ecb8f94c4f3b60'
      },
      {
        username: 'BytewithMahi',
        hash: '125f48f',
        timestamp: '2026-07-05T10:35:01Z',
        message: 'khel suru - Init Core Ingestion System',
        url: 'https://github.com/BytewithMahi/Swasthya/commit/125f48f393e5dc880cfc71e8c387a73bd280a611'
      }
    ];
    return NextResponse.json({ success: true, merges: fallbacks, cached: true });
  }
}
