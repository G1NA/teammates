/* global import BootboxWrapper from './common/bootboxWrapper.es6'; import { StatusType } from './const.es6'; */

const INSTRUCTOR_STUDENT_EDIT_FORM = '#instructor-student-edit-form';

$(document).ready(() => {
    readyInstructorStudentEditPage();
});

/*
 * Binds an event handler to the team field so that the change of the team name is identified
 * and the confirmation dialog is sent
 */
function readyInstructorStudentEditPage() {
    $(INSTRUCTOR_STUDENT_EDIT_FORM).on('submit', (event) => {
        const newStudentEmail = $('#newstudentemail').val();
        const isEmailFieldChanged = newStudentEmail !== $('#studentemail').val();
        const isOpenOrPublishedEmailSentInThisCourse = $('#openorpublishedemailsent').val();

        if ($(INSTRUCTOR_STUDENT_EDIT_FORM).attr('editStatus') === 'mustDeleteResponses') {
            event.preventDefault();

            const messageText = 'Editing these fields will result in some existing responses from this student '
                              + 'to be deleted. You may download the data before you make the changes. Are '
                              + 'you sure you want to continue?';
            const okCallback = function () {
                if (isEmailFieldChanged && isOpenOrPublishedEmailSentInThisCourse) {
                    sendEmailToNewEmailOption(event, newStudentEmail);
                } else {
                    event.target.submit();
                }
            };

            BootboxWrapper.showModalConfirmation('Confirm Deletion', messageText, okCallback, null,
                    BootboxWrapper.DEFAULT_OK_TEXT, BootboxWrapper.DEFAULT_CANCEL_TEXT, StatusType.WARNING);
        } else if (isEmailFieldChanged && isOpenOrPublishedEmailSentInThisCourse) {
            sendEmailToNewEmailOption(event, newStudentEmail);
        }
    });

    function sendEmailToNewEmailOption(event, newStudentEmail) {
        event.preventDefault();
        const messageText = `Do you want to resend past session links of this course to the new email ${
                 newStudentEmail}?`;
        const yesCallback = function () {
            $('#isSendEmail').val(true);
            event.target.submit();
        };
        const noCallback = function () {
            $('#isSendEmail').val(false);
            event.target.submit();
        };
        BootboxWrapper.showModalConfirmationWithCancel('Resend past links to the new email?', messageText,
                yesCallback, noCallback, null, 'Yes, save changes and resend links',
                'No, just save the changes', 'Cancel', StatusType.PRIMARY);
    }

    $('#teamname').change(() => {
        $(INSTRUCTOR_STUDENT_EDIT_FORM).attr('editStatus', 'mustDeleteResponses');
    });
}