fn main() {
    let sites = ["Larkfield", "Ashgrove", "Brightwater"];

    for (i, site) in sites.iter().enumerate() {
        println!("{}. {} has {} letters", i + 1, site, site.len());
    }

    let total: usize = sites.iter().map(|s| s.len()).sum();
    println!("Total letters: {total}");
}
