// The window. Run it to see a volume slider and tempo buttons.
use eframe::egui;
use rust_10_egui::Mixer;

struct MixerApp {
    mixer: Mixer,
}

impl eframe::App for MixerApp {
    // egui redraws this every frame. Whatever you draw is the whole window, and what the
    // buttons returned this frame is how you hear about clicks (immediate mode).
    fn ui(&mut self, ui: &mut egui::Ui, _frame: &mut eframe::Frame) {
        egui::CentralPanel::default().show(ui, |ui| {
            ui.heading("Mini mixer");

            // A slider edits a plain f32, so we copy the volume out, let the slider change the copy,
            // and hand any change to set_volume so the clamping rule still applies.
            let mut volume = self.mixer.volume;
            if ui.add(egui::Slider::new(&mut volume, 0.0..=1.0).text("Volume")).changed() {
                self.mixer.set_volume(volume);
            }
            ui.label(format!("Level: {}", self.mixer.level_label()));

            ui.horizontal(|ui| {
                if ui.button("- 5 bpm").clicked() {
                    self.mixer.nudge_tempo(-5);
                }
                ui.label(format!("{} bpm", self.mixer.tempo));
                if ui.button("+ 5 bpm").clicked() {
                    self.mixer.nudge_tempo(5);
                }
            });

            if ui.button("Mute").clicked() {
                self.mixer.toggle_mute();
            }

            ui.label(format!("Gain sent to the audio thread: {:.2}", self.mixer.output_gain()));
        });
    }
}

fn main() -> eframe::Result {
    let options = eframe::NativeOptions {
        viewport: egui::ViewportBuilder::default().with_title("Mini mixer").with_inner_size([360.0, 240.0]),
        ..Default::default()
    };
    eframe::run_native("Mini mixer", options, Box::new(|_cc| Ok(Box::new(MixerApp { mixer: Mixer::new() }))))
}
