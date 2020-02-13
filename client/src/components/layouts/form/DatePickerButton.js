import React from "react";
// Button Component for the Date Time Picker
// Set styling within the component that needs to leverage it

/**
 * Warning: Do not refactor to functional component.
 * DatePicker customInput prop needs a class component.
 */
class DatePickerButton extends React.Component {
    render() {
        const { value, onClick } = this.props;
        return (
            <>
                <button type="button" className="custom_datetime_input_button" onClick={onClick}>
                    {value ? value : "Select Date & Time"}
                </button>
            </>
        );
    }
}

export default DatePickerButton;
