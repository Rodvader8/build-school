// Lesson 7: traits. The Source trait is written for you: implement it for two types, then use it.

/// Anything that can make audio, one sample at a time.
pub trait Source {
    fn next_sample(&mut self) -> f32;
    fn name(&self) -> String;

    /// A default method: every Source gets this for free, unless it writes its own.
    fn describe(&self) -> String {
        format!("source: {}", self.name())
    }

    /// Another default: asks for `count` samples in a row.
    fn render(&mut self, count: usize) -> Vec<f32> {
        (0..count).map(|_| self.next_sample()).collect()
    }
}

/// A square wave: `period` samples per cycle, 1.0 for the first half and -1.0 for the second.
pub struct Square {
    period: u32,
    tick: u32,
}

impl Square {
    pub fn new(period: u32) -> Square {
        Square { period, tick: 0 }
    }
}

/// A ramp: starts at 0.0 and goes up by `step` each sample.
pub struct Ramp {
    value: f32,
    step: f32,
}

impl Ramp {
    pub fn new(step: f32) -> Ramp {
        Ramp { value: 0.0, step }
    }
}

// Fill in both impls. Each todo!() crashes until you replace it.

impl Source for Square {
    /// 1.0 if self.tick < self.period / 2, otherwise -1.0. Then move tick on by one,
    /// wrapping back to 0 at the end of the period (use %).
    fn next_sample(&mut self) -> f32 {
        todo!()
    }

    /// "square"
    fn name(&self) -> String {
        todo!()
    }
}

impl Source for Ramp {
    /// Return the current value, then add step to it. (Save the old value first.)
    fn next_sample(&mut self) -> f32 {
        todo!()
    }

    /// "ramp"
    fn name(&self) -> String {
        todo!()
    }
}

/// Renders `count` samples from any Source and returns the biggest absolute value.
/// `S: Source` is a generic: it accepts any type that implements the trait.
pub fn peak<S: Source>(source: &mut S, count: usize) -> f32 {
    todo!()
}

/// Asks every source for one sample per frame and adds them together. Returns `frames` mixed samples.
/// `Box<dyn Source>` is a trait object: different types in one Vec.
pub fn mix(sources: &mut [Box<dyn Source>], frames: usize) -> Vec<f32> {
    todo!()
}
