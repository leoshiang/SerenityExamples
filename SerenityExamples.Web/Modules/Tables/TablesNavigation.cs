using Serenity.Navigation;
using MyPages = SerenityExamples.Tables.Pages;

[assembly: NavigationLink(int.MaxValue, "Tables/訂單主檔", typeof(MyPages.OrdersPage), icon: null)]
[assembly: NavigationLink(int.MaxValue, "Tables/訂單明細檔", typeof(MyPages.OrderLinesPage), icon: null)]