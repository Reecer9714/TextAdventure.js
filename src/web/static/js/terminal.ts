// ===== Onload Functions ===========================================================
var inputBuffer: string[] = [];
var inputBufferIndex = 0;

function initializeTerminal(): void {
  displayResize();
  messageServer('get games');

  // ===== Event Handlers =============================================================
  // ----- Input Submit ---------------------------------------------------------------
  $('#console').submit(function (event) {
    event.preventDefault();
    var inputString = '' + $('#input').val();
    inputString = inputString.trim();
    $('#input').val('');
    toScreen(inputString, 'user');
    if (inputString !== '') {
      messageServer(inputString);
      if (inputString !== inputBuffer[inputBuffer.length - 1]) {
        inputBuffer.push(inputString);
      }
    }
    inputBufferIndex = inputBuffer.length;
  });
  // ----- Input Buffer ---------------------------------------------------------------
  $(document).trigger("keydown", function (event: KeyboardEvent) {
    switch (event.which) {
      case 38: // up
        if (inputBufferIndex > 0) {
          --inputBufferIndex;
        }
        $('#input').val(inputBuffer[inputBufferIndex]);
        break;
      case 40: // down
        if (inputBufferIndex < inputBuffer.length) {
          ++inputBufferIndex;
        }
        $('#input').val(inputBuffer[inputBufferIndex]);
        break;
      default:
        return;
    }
    event.preventDefault();
  });
  // ----- Window Resize Listener -----------------------------------------------------
  $(window).resize(function () {
    displayResize();
  });
}

initializeTerminal();

// ===== Functions ======================================================================
// ----- Send Message to Server ---------------------------------------------------------
function messageServer(message: string) {
  $.post(window.location.href + 'console', { input: message }, (data: any) => {
    toScreen(data.response, 'console');
  }).fail(function () {
    toScreen('Unable to reach server.', 'terminal');
  });
}
// ----- Insure Terminal Appearance -----------------------------------------------------
function displayResize(): void {
  $('#display').height($(window).height() - 30);
  $('#display').scrollTop($('#display')[0].scrollHeight);
}
// ----- Write to Screen ----------------------------------------------------------------
// ----- Write to Screen ----------------------------------------------------------------
function toScreen(message: string, actor: string): void {
  if (actor === 'user') {
    message = '> ' + message;
  }
  var displayString = $('#display').val() + message + '\n';
  $('#display').val(displayString);
  $('#display').scrollTop($('#display')[0].scrollHeight);
}
