using System;
using System.Collections.Generic;

namespace Home.Content
{
    public class NugetVersion
    {
        public string version { get; set; }
        public int downloads { get; set; }
        public string @id { get; set; }
    }
    public class NugetData
    {

        public string @id { get; set; }
        public string @type { get; set; }
        public string registration { get; set; }
        public string version { get; set; }
        public string description { get; set; }
        public string summary { get; set; }
        public string title { get; set; }
        public string iconUrl { get; set; }
        public string licenseUrl { get; set; }
        public string projectUrl { get; set; }
        public string[] tags { get; set; }
        public string[] authors { get; set; }
        public int totalDownloads { get; set; }
        public bool verified { get; set; }
        public NugetVersion[] versions { get; set; }
    }
    public class NugetResponse
    {
        public int totalHits { get; set; }
        public NugetData[] data { get; set; }
    }
    public class Nuget
    {
        public string PackageId { get; set; }
        public string Comments { get; set; }
        public NugetData Data { get; set; }
    }
    public class BlogPost
    {
        public string Href { get; set; }
        public DateTime Date { get; set; }
        public string Title { get; set; }
        public string Intro { get; set; }
    }
    public class VideoPost
    {
        public string Post { get; set; }
        public string Title { get; set; }
        public IEnumerable<string> Body { get; set; }
    }
}
