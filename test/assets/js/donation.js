/* Stepney Shah Jalal Mosque: Sign Soft donation app settings, shared by every page.
   Loaded after https://donations.signsoft.co.uk/web-apps/v1/live/init.js.
   Keeping the settings in this one file means every page uses the same config. */
const donationApp = new Donation({
    client_id: 3896,
    client_name: 'Stepney Shah Jalal Mosque',
    quick_donate: true,
    //types: ['Zakat', 'Sadaqah', 'Lillah', 'Fidyah', 'Kaffarah'],
    checkout: {
        title: false,
        gift_aid: true,
        comm_pref: false,
        paypal: false,
        quick_donate: 'skip-form' // 'show-form', 'skip-form'
    },
    theme: {
        primary_color: '#7F2230',
        secondary_color: '#0A3A25'
    }
});
