using HtmlKit;
using Microsoft.AspNetCore.Components;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace Home
{
    public class ContentService
    {
        static readonly string BASE = "https://raw.githubusercontent.com/Herdubreid/home-content/master/docs/";
        HttpClient Http { get; }
        public async Task<Content.VideoPost[]> GetLinkedinPostsAsync()
        {
            return await Http.GetJsonAsync<Content.VideoPost[]>($"{BASE}linkedin.json");
        }
        public async Task<Content.VideoPost[]> GetMsdnPostsAsync()
        {
            return await Http.GetJsonAsync<Content.VideoPost[]>($"{BASE}msdn.json");
        }
        public async Task<Content.VideoPost[]> GetYoutubeClipsAsync()
        {
            return await Http.GetJsonAsync<Content.VideoPost[]>($"{BASE}youtube.json");
        }
        public async Task<Content.Nuget[]> GetNugetAsync()
        {
            var nuget = await Http.GetJsonAsync<Content.Nuget[]>($"{BASE}nuget.json");
            foreach (var n in nuget)
            {
                var rs = await Http.GetAsync($"https://azuresearch-usnc.nuget.org/query?q=PackageId:{n.PackageId}");
                var ngRs = JsonSerializer.Deserialize<Content.NugetResponse>(await rs.Content.ReadAsStringAsync());
                if (ngRs.totalHits > 0)
                {
                    n.Data = ngRs.data[0];
                }
            }
            return nuget;
        }
        public async Task<List<Content.BlogPost>> GetBlogPostsAsync()
        {
            var rs = await Http.GetAsync("https://blog.celin.io");
            var reader = new StreamReader(rs.Content.ReadAsStreamAsync().Result);
            var tokenizer = new HtmlTokenizer(reader);
            bool start = false;
            bool blogs = false;
            List<Content.BlogPost> blog = new List<Content.BlogPost>();
            while (tokenizer.ReadNextToken(out var token))
            {
                var tag = token as HtmlTagToken;
                if (start)
                {
                    if (token.Kind == HtmlTokenKind.Tag && "a".Equals(tag.Name))
                    {
                        blogs = true;
                        var href = tag.Attributes.FirstOrDefault(a => "href".Equals(a.Name));
                        var post = new Content.BlogPost()
                        {
                            Href = href.Value
                        };
                        bool endTag = false;
                        while (tokenizer.ReadNextToken(out var postToken) && !endTag)
                        {
                            if (postToken.Kind == HtmlTokenKind.Tag)
                            {
                                var postTag = postToken as HtmlTagToken;
                                if (postTag.IsEndTag)
                                {
                                    endTag = "a".Equals(postTag.Name);
                                }
                                else
                                {
                                    if ("time".Equals(postTag.Name))
                                    {
                                        var dt = postTag.Attributes.FirstOrDefault(a => "datetime".Equals(a.Name));
                                        post.Date = DateTime.Parse(dt.Value);
                                    }
                                    if ("h1".Equals(postTag.Name)
                                        && tokenizer.ReadNextToken(out var pToken))
                                    {
                                        var content = pToken as HtmlDataToken;
                                        post.Title = content.Data;
                                    }
                                    if ("p".Equals(postTag.Name)
                                        && tokenizer.ReadNextToken(out var hToken))
                                    {
                                        var content = hToken as HtmlDataToken;
                                        post.Intro = content.Data;
                                    }
                                }
                            }
                        }
                        blog.Add(post);
                    }
                    else if (blogs)
                    {
                        start = false;
                    }
                }
                else
                {
                    start = token.Kind == HtmlTokenKind.Tag && "main".Equals(tag.Name);
                }
            }
            return blog;
        }
        public ContentService(HttpClient http)
        {
            Http = http;
        }
    }
}
