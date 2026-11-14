use rust_06_collections::*;

fn main() {
    let nights = vec![3, 2, 5, 1, 4, 2];
    println!("{} nights in total", total_nights(&nights));
    println!("long stays: {:?}", long_stays(&nights));

    let sales = [("Ocean Room", 1560), ("Garden Room", 760), ("Cliff Suite", 3800), ("Ocean Room", 520)];
    let totals = revenue_by_room(&sales);
    for room in rooms_sorted(&totals) {
        println!("{room}: ${}", totals[room.as_str()]);
    }
    println!("top room: {:?}", top_room(&totals));
}
