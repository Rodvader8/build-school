// Lesson 7: traits.

/// Anything that can make audio, one sample at a time.
pub trait Source {
    fn next_sample(&mut self) -> f32;
    fn name(&self) -> String;

    /// A default method: every Source gets this for free.
    fn describe(&self) -> String {
        format!("source: {}", self.name())
    }

    /// Another default: asks for `count` samples in a row.
    fn render(&mut self, count: usize) -> Vec<f32> {
        (0..count).map(|_| self.next_sample()).collect()
    }
}

/// A square wave.
pub struct Square {
    period: u32,
    tick: u32,
}

impl Square {
    pub fn new(period: u32) -> Square {
        Square { period, tick: 0 }
    }
}

/// A ramp.
pub struct Ramp {
    value: f32,
    step: f32,
}

impl Ramp {
    pub fn new(step: f32) -> Ramp {
        Ramp { value: 0.0, step }
    }
}

impl Source for Square {
    fn next_sample(&mut self) -> f32 {
        let sample = if self.tick < self.period / 2 { 1.0 } else { -1.0 };
        self.tick = (self.tick + 1) % self.period;
        sample
    }

    fn name(&self) -> String {
        String::from("square")
    }
}

impl Source for Ramp {
    fn next_sample(&mut self) -> f32 {
        let sample = self.value;
        self.value += self.step;
        sample
    }

    fn name(&self) -> String {
        String::from("ramp")
    }
}

/// Renders `count` samples from any Source and returns the biggest absolute value.
pub fn peak<S: Source>(source: &mut S, count: usize) -> f32 {
    let mut biggest = 0.0;
    for sample in source.render(count) {
        if sample.abs() > biggest {
            biggest = sample.abs();
        }
    }
    biggest
}

/// Asks every source for one sample per frame and adds them together.
pub fn mix(sources: &mut [Box<dyn Source>], frames: usize) -> Vec<f32> {
    let mut out = Vec::new();
    for _ in 0..frames {
        let mut sum = 0.0;
        for source in sources.iter_mut() {
            sum += source.next_sample();
        }
        out.push(sum);
    }
    out
}
