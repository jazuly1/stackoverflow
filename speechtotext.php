@foreach ($ShowJournal as $value)
<tr>
  <td>{{ $value->Heading }}</td>
  <td>
      <input class="form-control" name="id[]" value="{{ $value->id }}" hidden>
      <textarea class="form-control stt{{ $value->id }}" name="Description[]" rows="3" <?php if($value->SignSave == 1) {echo "readonly";} ?>>{{ $value->Description }}</textarea>
      @if ($value->SignSave == 1)
        <div style="margin-top: 5px;">
          <span style="padding-right: 5px;"><i class="fa fa-id-badge"></i> {{ $value->InsertedByPersonID }}</span>
          <span style="padding-right: 5px;"><i class="fa fa-user-md"></i> {{ $value->name }}</span>
          <span style="padding-right: 5px;"><i class="fa fa-calendar"></i> {{ $value->updated_at }}</span>
          <span style="padding-right: 5px;"><i class="fa fa-star"></i> {{ $value->MenuChoice }}</span>
        </div>
      @else
        <div style="margin-top: 5px;display: inline-flex;height: 40px;">
          <button id="{{ $value->id }}" class="SavenSign btn btn-primary">Save & Sign</button>
            <select class="form-control" id="selectlanguage" onchange="language()">
                <option value="" readonly selected>Select Diagnosis</option>
                <option value="en-US">English</option>
                <option value="id-ID">Bahasa Indonesia</option>
                <option value="nb-NO">Norsk bokmål</option>
            </select>
          <a href="javascript:;" onclick="Speech(event, id = '{{ $value->id }}')" class="btn btn-sm btn-primary" style="margin-right: 5px;padding-top: 10px;">
            Speech
          </a>
          <a href="javascript:;" onclick="Speech(event, id = '{{ $value->id }}', Stop = true)" class="btn btn-sm btn-primary" style="margin-right: 5px;padding-top: 10px;">
            Stop
          </a>
        </div>
      @endif
  </td>
  <td>
      <input class="form-control" value="{{ $value->Comment }}" name="Comment[]">
  </td>
</tr>
@endforeach

<script>
$(document).ready(function() {
  $(".SavenSign").click(function(){
      var id = $(this).attr('id');
        $.ajax({
          type: "POST",
          url: "/update/examination/journal/"+id,
          data: {
              _token: "{{ csrf_token() }}",
          },
          success: function() {
                  alert('Success Update Sign & Save.')
              }
        });
        return false;
  }); 
});
</script>

<script>
var SpeechLang = 'en-US';
function language() {
  SpeechLang = document.getElementById("selectlanguage").value;
}
function Speech(event, id, Stop) {
  window.SpeechRecognition = window.webkitSpeechRecognition ||
                            window.mozSpeechRecognition ||
                            window.msSpeechRecognition ||
                            window.oSpeechRecognition ||
                            window.SpeechRecognition;

  let finalTranscript = '';
  let recognition = new window.SpeechRecognition();


  if (SpeechLang) {
    SpeechLang = SpeechLang;
  }

  var targ = event.target || event.srcElement;
  var textarea = document.getElementsByClassName("stt"+id).value += targ.textContent || targ.innerText;

  recognition.lang = SpeechLang;
  recognition.interimResults = true;
  recognition.maxAlternatives = 10;
  recognition.continuous = true;

  recognition.onresult = (event) => {
    let interimTranscript = '';
    for (let i = event.resultIndex, len = event.results.length; i < len; i++) {
      let transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }
    textarea = finalTranscript + interimTranscript;
  }

  recognition.start();

  if (Stop) {
    recognition.stop();
  };
}
</script>
