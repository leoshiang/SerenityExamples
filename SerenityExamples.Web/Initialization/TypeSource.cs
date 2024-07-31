using Serenity.Localization;
using System.Reflection;

namespace SerenityExamples.AppServices;
public class TypeSource : DefaultTypeSource
{
    public TypeSource()
        : base(GetAssemblyList())
    {
    }

    private static Assembly[] GetAssemblyList()
    {
        return
        [
            typeof(LocalTextRegistry).Assembly,
            typeof(ISqlConnections).Assembly,
            typeof(IRow).Assembly,
            typeof(SaveRequestHandler<>).Assembly,
            typeof(IDynamicScriptManager).Assembly,
            typeof(EnvironmentSettings).Assembly,
            typeof(BackgroundJobManager).Assembly,
            typeof(Serenity.Demo.Northwind.CustomerPage).Assembly,
            typeof(Serenity.Demo.BasicSamples.BasicSamplesPage).Assembly,
            typeof(Serenity.Demo.AdvancedSamples.AdvancedSamplesPage).Assembly,
            typeof(Serenity.Pro.DataAuditLog.DataAuditLogPage).Assembly,
            typeof(Serenity.Pro.DataExplorer.DataExplorerPage).Assembly,
            typeof(Serenity.Pro.EmailClient.MailboxPage).Assembly,
            typeof(Serenity.Pro.EmailQueue.EmailQueuePage).Assembly,
            typeof(Serenity.Pro.Organization.BusinessUnitPage).Assembly,
            typeof(Serenity.Pro.Meeting.MeetingPage).Assembly,
            typeof(Serenity.Pro.WorkLog.WorkLogPage).Assembly,
            typeof(Startup).Assembly
        ];
    }
}