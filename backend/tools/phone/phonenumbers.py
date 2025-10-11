import phonenumbers
from phonenumbers import geocoder, carrier, timezone
from typing import Dict, Any
from tools.base import BaseTool, ToolOutput, ToolCategory, ToolStatus

class PhoneNumbersTool(BaseTool):
    """
    Phone number OSINT tool using phonenumbers library for validation and carrier lookup
    """
    
    def __init__(self):
        super().__init__()
        self.category = ToolCategory.PHONE
        self.required_inputs = ['phone']
        self.max_execution_time = 30
    
    def validate_inputs(self, inputs: Dict[str, Any]) -> bool:
        return 'phone' in inputs and len(inputs['phone']) > 5
    
    async def execute(self, inputs: Dict[str, Any]) -> ToolOutput:
        phone_number = inputs['phone']
        country_hint = inputs.get('country_hint', None)
        
        try:
            # Parse phone number
            parsed = phonenumbers.parse(phone_number, country_hint)
            
            # Validation
            is_valid = phonenumbers.is_valid_number(parsed)
            is_possible = phonenumbers.is_possible_number(parsed)
            
            # Get information
            country_code = phonenumbers.region_code_for_number(parsed)
            country_name = phonenumbers.region_code_for_country_code(parsed.country_code)
            carrier_name = carrier.name_for_number(parsed, "en")
            location = geocoder.description_for_number(parsed, "en")
            timezones = timezone.time_zones_for_number(parsed)
            
            # Number type
            number_type = phonenumbers.number_type(parsed)
            type_mapping = {
                phonenumbers.PhoneNumberType.MOBILE: "mobile",
                phonenumbers.PhoneNumberType.FIXED_LINE: "landline",
                phonenumbers.PhoneNumberType.FIXED_LINE_OR_MOBILE: "fixed_or_mobile",
                phonenumbers.PhoneNumberType.TOLL_FREE: "toll_free",
                phonenumbers.PhoneNumberType.PREMIUM_RATE: "premium_rate",
                phonenumbers.PhoneNumberType.SHARED_COST: "shared_cost",
                phonenumbers.PhoneNumberType.VOIP: "voip",
                phonenumbers.PhoneNumberType.PERSONAL_NUMBER: "personal",
                phonenumbers.PhoneNumberType.PAGER: "pager",
                phonenumbers.PhoneNumberType.UAN: "uan",
                phonenumbers.PhoneNumberType.VOICEMAIL: "voicemail",
                phonenumbers.PhoneNumberType.UNKNOWN: "unknown"
            }
            line_type = type_mapping.get(number_type, "unknown")
            
            parsed_data = {
                "phone_number": phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.INTERNATIONAL),
                "country_code": country_code,
                "country_name": country_name,
                "carrier": carrier_name or "Unknown",
                "line_type": line_type,
                "is_valid": is_valid,
                "is_possible": is_possible,
                "timezone": list(timezones)[0] if timezones else None,
                "region": location or "Unknown",
                "location_data": {
                    "country_code": country_code,
                    "region": location,
                    "timezones": list(timezones)
                },
                "analysis": {
                    "risk_level": "low" if is_valid else "high",
                    "confidence": "high" if is_valid and carrier_name else "medium"
                }
            }
            
            return ToolOutput(
                tool_name=self.name,
                category=self.category,
                status=ToolStatus.SUCCESS,
                data=parsed_data,
                metrics=self.metrics,
                raw_output=str(parsed_data),
                confidence_score=0.92 if is_valid else 0.5
            )
            
        except phonenumbers.NumberParseException as e:
            error_data = {
                "error": f"Phone number parsing failed: {str(e)}",
                "phone_number": phone_number,
                "is_valid": False,
                "analysis": {
                    "risk_level": "high",
                    "confidence": "low"
                }
            }
            
            return ToolOutput(
                tool_name=self.name,
                category=self.category,
                status=ToolStatus.SUCCESS,
                data=error_data,
                metrics=self.metrics,
                raw_output=str(error_data),
                confidence_score=0.1
            )