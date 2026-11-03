/* GlenScanner — τι παίρνει ο παραλήπτης «Μεταφορά στοιχείων» (metafora-lipsi.js) από την παλιά διεύθυνση
   aglentzakis-dot.github.io/GlenScanner/ → glenscanner.glenapps.gr.
   © 2026 Ανδρέας Μ. Γλεντζάκης (Andreas M. Glentzakis). Με την επιφύλαξη παντός δικαιώματος. All rights reserved.
   ls   : όλες οι ρυθμίσεις και τα στοιχεία «glenscanner-…» (ρυθμίσεις, φάκελοι, εξαγωγή, υπογραφή, Drive, αντίγραφα)
   idb  : οι σαρώσεις («glenscanner») και τα κλειδιά αντιγράφων Drive («glenapps-kleidia-glenscanner»)
   opfs : τίποτα (η εφαρμογή δεν χρησιμοποιεί ιδιωτική μνήμη αρχείων)
   Η βάση «glenread» ανήκει στο GlenRead και μεταφέρεται από εκείνο, όχι από εδώ.
   Ο φάκελος αντιγράφων του κινητού («shared-backups») ΔΕΝ μεταφέρεται: ξαναδιαλέγεται στη νέα διεύθυνση.
   exei : αν εδώ υπάρχουν ήδη σαρώσεις (για την προειδοποίηση πριν από την αντικατάσταση). */
window.GLEN_METAFORA={app:"glenscanner",onoma:"GlenScanner",
  ls:["glenscanner-"],
  idb:["glenscanner","glenapps-kleidia-glenscanner"],
  opfs:[],
  exei:function(){try{
    /* docsCache: οι σαρώσεις που έχει ήδη φορτώσει η εφαρμογή από τη βάση της */
    if(typeof docsCache!=="undefined"&&Array.isArray(docsCache)&&docsCache.length>0)return true;
    if(localStorage.getItem("glenscanner-bk-last"))return true;
    var f=JSON.parse(localStorage.getItem("glenscanner-folders")||"null");
    return Array.isArray(f)?f.length>0:!!(f&&typeof f==="object"&&Object.keys(f).length);
  }catch(e){return true}}};
