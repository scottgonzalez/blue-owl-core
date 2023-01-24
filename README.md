# Blue Owl

Blue Owl provides Technical Official device integration for [OWLCMS](https://owlcms.github.io/owlcms4/). The [Johnny-Five](http://johnny-five.io/) software is used to control the devices' microprocessors using the [Firmata](https://github.com/firmata/protocol) protocol.

### About this Fork

- This fork does not replace the upstream directory by Scott González.  The files in `src` are meant to be match official upstream version.
- The `Releases` directory in this fork contains the programs necessary to run the program on Windows, Mac or Linux.
- This fork adds a `build-it-yourself` directory that contains
  - Diagrams for building your own devices.  An interactive version of the diagram can be loaded on  [wokwi.com](https://wokwi.com) to get the exact pin numbers etc.
  - Scripts for running the device using the blue-owl library.  If you build your own design and need to change pin assignments, then you can simply change the scripts, and even [rebuild your own executable](BUILDING.md))
  - Definitions of the build-it-yourself devices and instructions for running them on the [wokwi.com](https://wokwi.com) simulator.  You can actually connect the simulated devices to owlcms, click on the virtual buttons, see the virtual LEDs and hear the virtual beeps.

## Features

- No coding whatsoever is required to build the devices.  Standard Firmata firmware (included) is loaded on the devices, once.  A laptop provides power and a program (included) is used to control the devices.
- Schematics and configurations are provided for building the physical devices yourself.  If there are parts you don't need, simply omit them.
- If you need to change the pin assignments, there are instructions for doing so and rebuilding the control program.  The firmware does not change.

## Overview

The following diagram illustrates the concept. We use the Refereeing devices as an example, but the same applies to the Jury and Timekeeper devices.

![Firmata](build-it-yourself/overview.drawio.png)

- The Referee Control Box contains a tiny Arduino Nano microprocessor that is pre-loaded with the Firmata software.  It gets its power and instructions from the Countdown athlete-facing laptop.   A version with [Down Signal Relays](./build-it-yourself/diagrams/referee/refereeBoxDown.png) relays is also available.   The referee keypads are connected to the Arduino with a wire and only contain two buttons, a buzzer, and a LED.

  ![refBox](build-it-yourself/diagrams/referee/refereeBox.png)

- Blue Owl acts as a relay between owlcms and the Arduino.
  - The control box reads the buttons pressed by referees when they enter decisions.  it notifies Blue Owl using the Firmata protocol.  Blue Owl relays the events to owlcms using [MQTT messages](https://owlcms.github.io/owlcms4/#/MQTTMessages).
  - Blue Owl reads MQTT commands from owlcms and sends Firmata instructions to the referee control box. The control box can then activate the LEDs or buzzers on the referee devices.
  
- If owlcms is modified, the only thing that needs to change is the Blue Owl software on the laptop.
  - There are different launchers for each device that call the appropriate definition script for the device.
  - The jury Blue Owl would run on the jury laptop, the referee Blue Owl would run on the countdown laptop, and the timekeeper Blue Owl would run either on the announcer or timekeeper laptop.

## Running

The `Releases` directory in this fork contains a simple interactive Windows executable for launching the control program on a laptop (see [instructions](INSTALLING_Windows.md)). The necessary files for starting the program on Mac and Linux are also available (see [instructions](INSTALLING_Mac_Linux.md)).

## Supported Devices

### Referees

Referee control boxes may be used in compliance with the IWF Referee Light System as documented in TCRR 3.3.6. The referee control boxes support:

* White and red buttons for "Good lift" and "No lift".
* White and red LEDs to confirm decision entry.
* LED, buzzer, and vibration to signal when a decision is required.
* LED, buzzer, and vibration to signal when summoned to the jury table.
* Triggering two relays, one to control a lamp, the other to control an external buzzer.

#### Single Referee Mode

For competitions run with only one referee, simply configure all three referees with the same buttons. This will cause the single referee control box to send a decision for all three referees.



### Timekeeper

The timekeeper control box may be used to fully control the timing clock as documented in TCRR 7.10. The timekeeper control box supports:

* Starting the clock.
* Stopping the clock.
* Resetting the clock to one minute.
* Resetting the clock to two minutes.

### Jury

The jury control panel and jury control units may be used to fulfill all jury member requirements as documented in TCRR 3.3.6.11, TCRR 3.3.6.12, and TCRR 7.5. The jury control panel supports:

* Displaying referee decisions in real-time.
* Displaying jury member decisions.
* Summoning a referee.
* Summoning the technical controller.
* Stopping the competition for deliberation.
* Stopping the competition for a technical break.
* Resuming the competition.

## API

Blue Owl is programmed in JavaScript using the Johnny-Five implementation of Firmata.  The full specification of the devices is documented in the [API](API.md) document.

Blue Owl talks to owlcms using MQTT messages.  The full list of messages supported by owlcms is documented: [MQTT messages](https://owlcms.github.io/owlcms4/#/MQTTMessages).

## About the names

#### Decision

The strings `bad` and `good`.

#### JuryMemberNumber

The numbers `1`, `2`, `3`, `4`, and `5`.

#### RefereeNumber

The numbers `1`, `2`, and `3`.

### Owlcms

The `Owlcms` class provides the necessary APIs for two way communication between the models and OWLCMS. Unless you are building a custom integration with OWLCMS that does not use the provided models, the API provided by `Owlcms` will not be used directly.

#### constructor(options)

* `options`: Configuration options for OWLCMS.
    * `url`: The URL for the MQTT server that OWLCMS is connected to.



### Jury

#### constructor(options)

* `options`: Configuration options for the jury.
    * `members` (`Array<JuryMember>`): `JuryMember` instances for each of the three or five jury members.
    * `modules` (`Array<(jury: Jury) => void>`): A set of modules that provide hardware-specific implementations.
    * `owlcms` (`Owlcms`): An instance of `Owlcms`.
    * `platform` (`string`): The name of the platform.

#### Modules

##### buttons(options)

Provides functionality for starting and stopping the competition, including summoning other officials.

* `options`: Configuration options for the buttons.
    * `badLiftButton` (`number | string`): Which pin the bad lift button is connected to.
    * `badLiftButtonPullUp` (optional; `boolean`): Whether the bad lift button should use an internal pull-up resistor.
    * `board` (optional; `Board`): Which Johnny-Five board the buttons are connected to.
    * `deliberationButton` (`number | string`): Which pin the deliberation break button is connected to.
    * `deliberationButtonPullUp` (optional; `boolean`): Whether the deliberation break button should use an internal pull-up resistor.
    * `goodLiftButton` (`number | string`): Which pin the good lift button is connected to.
    * `goodLiftButtonPullUp` (optional; `boolean`): Whether the good lift button should use an internal pull-up resistor.
    * `resumeCompetitionButton` (`number | string`): Which pin the resume competition button is connected to.
    * `resumeCompetitionButtonPullUp` (optional; `boolean`): Whether the resume competition button should use an internal pull-up resistor.
    * `summonAllRefereesButton` (optional; `number | string`): Which pin the summon all referees button is connected to.
    * `summonAllRefereesButtonPullUp` (optional; `boolean`): Whether the summon all referees button should use an internal pull-up resistor.
    * `summonReferee1Button` (`number | string`): Which pin the summon referee 1 button is connected to.
    * `summonReferee1ButtonPullUp` (optional; `boolean`): Whether the summon referee 1 button should use an internal pull-up resistor.
    * `summonReferee2Button` (`number | string`): Which pin the summon referee 2 button is connected to.
    * `summonReferee2ButtonPullUp` (optional; `boolean`): Whether the summon referee 2 button should use an internal pull-up resistor.
    * `summonReferee3Button` (`number | string`): Which pin the summon referee 3 button is connected to.
    * `summonReferee3ButtonPullUp` (optional; `boolean`): Whether the summon referee 3 button should use an internal pull-up resistor.
    * `summonTechnicalControllerButton` (`number | string`): Which pin the summon technical controller button is connected to.
    * `summonTechnicalControllerButtonPullUp` (optional; `boolean`): Whether the summon technical controller button should use an internal pull-up resistor.
    * `technicalBreakButton` (`number | string`): Which pin the technical break button is connected to.
    * `technicalBreakButtonPullUp` (optional; `boolean`): Whether the technical break button should use an internal pull-up resistor.

##### referee-leds(options)

Provides functionality for real-time referee decision LEDs.

* `options`: Configuration options for the LEDs.
    * `board` (optional; `Board`): Which Johnny-Five board the LEDs are connected to.
    * `referee1BadLiftLed` (`number | string`): Which pin the referee 1 bad lift LED is connected to.
    * `referee1GoodLiftLed` (`number | string`): Which pin the referee 1 good lift LED is connected to.
    * `referee2BadLiftLed` (`number | string`): Which pin the referee 2 bad lift LED is connected to.
    * `referee2GoodLiftLed` (`number | string`): Which pin the referee 2 good lift LED is connected to.
    * `referee3BadLiftLed` (`number | string`): Which pin the referee 3 bad lift LED is connected to.
    * `referee3GoodLiftLed` (`number | string`): Which pin the referee 3 good lift LED is connected to.

##### referee-rgb-leds(options)

Provides functionality for real-time referee decision RGB LEDs.

* `options`: Configuration options for the RGB LEDs.
    * `anode` (optional; `boolean`): Whether the RGB LEDs are common anode.
    * `board` (optional; `Board`): Which Johnny-Five board the LEDs are connected to.
    * `referee1Pins` (object with `red`, `green`, and `blue` keys): Which pin each of the referee 1 RGB LED leads is connected to.
    * `referee2Pins` (object with `red`, `green`, and `blue` keys): Which pin each of the referee 2 RGB LED leads is connected to.
    * `referee3Pins` (object with `red`, `green`, and `blue` keys): Which pin each of the referee 3 RGB LED leads is connected to.

#### Events

##### initialized

The model has been initialized.

##### refereeDecision(data)

A referee decision has been made.

* `data`: Data about the decision.
    * `decision` (`Decision`): The referee's decision.
    * `number` (`RefereeNumber`): The number indicating which referee made the decision.

##### resetRefereeDecisions

The referee decisions should be cleared because a clock has started for a new attempt.

#### Methods

##### publishDecision(decision)

Publish the jury's decision for the lift under deliberation.

* `decision` (`Decision`): The jury's decision of whether the lift was good or bad.

##### resumeCompetition()

Resume the competition.

##### startDeliberation()

Stop the competition for the jury to deliberate about the previous attempt.

##### startTechnicalBreak()

Stop the competition for a technical break.

##### summonReferee(referee)

Summon a referee to the jury table.

* `referee` (`RefereeNumber`): The number of the referee to summon.

##### summonTechnicalController()

Summon the technical controller to the jury table.



### JuryMember

#### constructor(options)

* `options`: Configuration options for the jury member.
    * `modules` (`Array<(juryMember: JuryMember) => void>`): A set of modules that provide hardware-specific implementations.
    * `number` (`JuryMemberNumber`): The jury memeber number.
    * `owlcms` (`Owlcms`): An instance of `Owlcms`.
    * `platform` (`string`): The name of the platform.

#### Modules

##### buttons(options)

Provides functionality for good and bad lift buttons to submit the jury member's decision.

* `options`: Configuration options for the buttons.
    * `badLiftButton` (`number | string`): Which pin the bad lift button is connected to.
    * `badLiftButtonPullUp` (optional; `boolean`): Whether the bad lift button should use an internal pull-up resistor.
    * `board` (optional; `Board`): Which Johnny-Five board the buttons are connected to.
    * `goodLiftButton` (`number | string`): Which pin the good lift button is connected to.
    * `goodLiftButtonPullUp` (optional; `boolean`): Whether the good lift button should use an internal pull-up resistor.

##### rgb-led(options)

Provides functionality for displaying the jury member's decision on the jury panel. When a decision is made, the light will turn green and when all jury members have made a decision, the light will chnge to white or red to indicate a good or bad lift.

* `options`: Configuration options for the RGB LED.
    * `anode` (optional; `boolean`): Whether the RGB LED is common anode.
    * `board` (optional; `Board`): Which Johnny-Five board the LEDs are connected to.
    * `pins` (object with `red`, `green`, and `blue` keys): Which pin each of the RGB LED leads is connected to.

#### Events

##### decision(data)

The jury member has made a decision about the current attempt.

* `data`: Data about the decision being revealed.
    * `decision` (`Decision`): Whether the lift was good or bad.

##### reset

##### reveal(data)

Reveal the decision on the jury panel because all jury members have sumitted a decision.

* `data`: Data about the decision being revealed.
    * `decision` (`Decision`): Whether the lift was good or bad.

#### Methods

##### publishDecision(decision)

Publish the jury member's decision for the current attempt.

* `decision` (`Decision`): The jury members's decision of whether the lift was good or bad.

##### resetDecision()

Reset the decision because a clock has started for a new attempt.

##### revealDecision()

Reveal the decision on the jury panel because all jury members have sumitted a decision.



### Referee

#### constructor(options)

* `options`: Configuration options for the referee.
    * `modules` (`Array<(referee: Referee) => void>`): A set of modules that provide hardware-specific implementations.
    * `number` (`RefereeNumber`): The referee number, with `1` being the referee on the left.
    * `owlcms` (`Owlcms`): An instance of `Owlcms`.
    * `platform` (`string`): The name of the platform.

#### Modules

##### buttons(options)

Provides functionality for good and bad lift buttons to submit the referee's decision.

* `options`: Configuration options for the buttons.
    * `badLiftButton` (`number | string`): Which pin the bad lift button is connected to.
    * `badLiftButtonPullUp` (optional; `boolean`): Whether the bad lift button should use an internal pull-up resistor.
    * `board` (optional; `Board`): Which Johnny-Five board the buttons are connected to.
    * `goodLiftButton` (`number | string`): Which pin the good lift button is connected to.
    * `goodLiftButtonPullUp` (optional; `boolean`): Whether the good lift button should use an internal pull-up resistor.

##### buzzer(options)

Provides audible feedback to the referee, via a piezo buzzer, when a decision is required and when the jury summons the referee.

* `options`: Configuration options for the buzzer.
    * `board` (optional; `Board`): Which Johnny-Five board the buzzer is connected to.
    * `piezo` (`number | string`): Which pin the buzzer is connected to.

##### confirmation-leds(options)

Provides visual confirmation that OWLCMS has acknowledged the decision.

* `options`: Configuration options for the LEDs.
    * `badLiftLed` (`number | string`): Which pin the bad lift LED is connected to.
    * `board` (optional; `Board`): Which Johnny-Five board the LEDs are connected to.
    * `goodLiftLed` (`number | string`): Which pin the good lift LED is connected to.

*NOTE: `badLiftLed` and `goodLiftLed` may be set to the same pin if a single LED is being used to confirm the decision was submitted, without indicating which decision was submitted.*

##### warning-led(options)

Provides visual feedback to the referee, via an LED, when a decision is required and when the jury summons the referee.

* `options`: Configuration options for the LED.
    * `board` (optional; `Board`): Which Johnny-Five board the LED is connected to.
    * `led` (`number | string`): Which pin the warning LED is connected to.

##### vibration(options)

Provides tactile feedback to the referee, via a vibration motor, when a decision is required and when the jury summons the referee.

* `options`: Configuration options for the vibration motor.
    * `board` (optional; `Board`): Which Johnny-Five board the vibration motor is connected to.
    * `vibrationMotor` (`number | string`): Which pin the vibration motor is connected to.

#### Events

The `Referee` class emits the following events:

##### decisionConfirmed(data)

OWLCMS has acknowledged the referee's decision.

* `data`: Data about the decision confirmation.
    * `decision` (`Decision`): The decision that was acknowledged by OWLCMS.

##### decisionRequest

The other two referees have made a decision and the athlete is waiting for a decision from the final referee.

##### initialized

The model has been initialized.

##### summon

The jury has summoned the referee to the jury table.

#### Methods

##### publishDecision(decision)

Publish a decision for the current attempt.

* `decision` (`Decision`): The referee's decision of whether the lift was good or bad.



### Timekeeper

#### constructor(options)

* `options`: Configuration options for the timekeeper.
    * `modules` (`Array<(timekeeper: Timekeeper) => void>`): A set of modules that provide hardware-specific implementations.
    * `owlcms` (`Owlcms`): An instance of `Owlcms`.
    * `platform` (`string`): The name of the platform.

#### Modules

##### buttons(options)

Provides functionality for controlling the clock.

* `options`: Configuration options for the buttons.
    * `board` (optional; `Board`): Which Johnny-Five board the buttons are connected to.
    * `oneMinuteButton` (`number | string`): Which pin the one minute button is connected to.
    * `oneMinuteButtonPullUp` (optional; `boolean`): Whether the one minute button should use an internal pull-up resistor.
    * `startButton` (`number | string`): Which pin the start button is connected to.
    * `startButtonPullUp` (optional; `boolean`): Whether the start button should use an internal pull-up resistor.
    * `stopButton` (`number | string`): Which pin the stop button is connected to.
    * `stopButtonPullUp` (optional; `boolean`): Whether the stop button should use an internal pull-up resistor.
    * `twoMinuteButton` (`number | string`): Which pin the two minute button is connected to.
    * `twoMinuteButtonPullUp` (optional; `boolean`): Whether the two minute button should use an internal pull-up resistor.

#### Events

##### initialized

The model has been initialized.

#### Methods

##### oneMinuteClock()

Reset the clock to one minute.

##### startClock()

Start (resume) the clock.

##### stopClock()

Stop (pause) the clock.

##### twoMinuteClock()

Reset the clock to two minutes.



## License

Copyright Scott González. Released under the terms of the ISC license.

Buid-it-yourself files and layouts are Copyright Jean-François Lamy, Released under the terms of the ISC license.
