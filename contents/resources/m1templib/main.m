// This code is originally from https://github.com/freedomtan/sensors/blob/master/sensors/sensors.m
// Here is the original code's license

// BSD 3-Clause License

// Copyright (c) 2016-2018, "freedom" Koan-Sin Tan
// All rights reserved.

// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:

// * Redistributions of source code must retain the above copyright notice, this
//   list of conditions and the following disclaimer.

// * Redistributions in binary form must reproduce the above copyright notice,
//   this list of conditions and the following disclaimer in the documentation
//   and/or other materials provided with the distribution.

// * Neither the name of the copyright holder nor the names of its
//   contributors may be used to endorse or promote products derived from
//   this software without specific prior written permission.

// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
// AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
// IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
// FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
// DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
// CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
// OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


#include <IOKit/hidsystem/IOHIDEventSystemClient.h>
#include <Foundation/Foundation.h>
#include <stdio.h>

// Declarations from other IOKit source code

typedef struct __IOHIDEvent *IOHIDEventRef;
typedef struct __IOHIDServiceClient *IOHIDServiceClientRef;
#ifdef __LP64__
typedef double IOHIDFloat;
#else
typedef float IOHIDFloat;
#endif

IOHIDEventSystemClientRef IOHIDEventSystemClientCreate(CFAllocatorRef allocator);
int IOHIDEventSystemClientSetMatching(IOHIDEventSystemClientRef client, CFDictionaryRef match);
int IOHIDEventSystemClientSetMatchingMultiple(IOHIDEventSystemClientRef client, CFArrayRef match);
IOHIDEventRef IOHIDServiceClientCopyEvent(IOHIDServiceClientRef, int64_t , int32_t, int64_t);
CFStringRef IOHIDServiceClientCopyProperty(IOHIDServiceClientRef service, CFStringRef property);
IOHIDFloat IOHIDEventGetFloatValue(IOHIDEventRef event, int32_t field);

CFDictionaryRef matching(int page, int usage)
{
    CFNumberRef nums[2];
    CFStringRef keys[2];

    keys[0] = CFStringCreateWithCString(0, "PrimaryUsagePage", 0);
    keys[1] = CFStringCreateWithCString(0, "PrimaryUsage", 0);
    nums[0] = CFNumberCreate(0, kCFNumberSInt32Type, &page);
    nums[1] = CFNumberCreate(0, kCFNumberSInt32Type, &usage);

    CFDictionaryRef dict = CFDictionaryCreate(0, (const void**)keys, (const void**)nums, 2, &kCFTypeDictionaryKeyCallBacks, &kCFTypeDictionaryValueCallBacks);
    return dict;
}

CFArrayRef getProductNames(CFDictionaryRef sensors) {
    IOHIDEventSystemClientRef system = IOHIDEventSystemClientCreate(kCFAllocatorDefault); // in CFBase.h = NULL
    // ... this is the same as using kCFAllocatorDefault or the return value from CFAllocatorGetDefault()
    IOHIDEventSystemClientSetMatching(system, sensors);
    CFArrayRef matchingsrvs = IOHIDEventSystemClientCopyServices(system); // matchingsrvs = matching services

    long count = CFArrayGetCount(matchingsrvs);
    CFMutableArrayRef array = CFArrayCreateMutable(kCFAllocatorDefault, 0, &kCFTypeArrayCallBacks);

    for (int i = 0; i < count; i++) {
        IOHIDServiceClientRef sc = (IOHIDServiceClientRef)CFArrayGetValueAtIndex(matchingsrvs, i);
        CFStringRef name = IOHIDServiceClientCopyProperty(sc, CFSTR("Product")); // here we use ...CopyProperty
        if (name) {
            CFArrayAppendValue(array, name);
        } else {
            CFArrayAppendValue(array, @"noname"); // @ gives a Ref like in "CFStringRef name"
        }
    }
    return array;
}

// from IOHIDFamily/IOHIDEventTypes.h
// e.g., https://opensource.apple.com/source/IOHIDFamily/IOHIDFamily-701.60.2/IOHIDFamily/IOHIDEventTypes.h.auto.html

#define IOHIDEventFieldBase(type)   (type << 16)
#define kIOHIDEventTypeTemperature  15
#define kIOHIDEventTypePower        25

CFArrayRef getPowerValues(CFDictionaryRef sensors) {
    IOHIDEventSystemClientRef system = IOHIDEventSystemClientCreate(kCFAllocatorDefault);
    IOHIDEventSystemClientSetMatching(system, sensors);
    CFArrayRef matchingsrvs = IOHIDEventSystemClientCopyServices(system);

    long count = CFArrayGetCount(matchingsrvs);
    CFMutableArrayRef array = CFArrayCreateMutable(kCFAllocatorDefault, 0, &kCFTypeArrayCallBacks);
    for (int i = 0; i < count; i++) {
        IOHIDServiceClientRef sc = (IOHIDServiceClientRef)CFArrayGetValueAtIndex(matchingsrvs, i);
        IOHIDEventRef event = IOHIDServiceClientCopyEvent(sc, kIOHIDEventTypePower, 0, 0);

        CFNumberRef value;
        if (event != 0) {
            double temp = IOHIDEventGetFloatValue(event, IOHIDEventFieldBase(kIOHIDEventTypePower));
            value = CFNumberCreate(kCFAllocatorDefault, kCFNumberDoubleType, &temp);
        } else {
            double temp = 0;
            value = CFNumberCreate(kCFAllocatorDefault, kCFNumberDoubleType, &temp);
        }
        CFArrayAppendValue(array, value);
    }
    return array;
}

CFArrayRef getThermalValues(CFDictionaryRef sensors) {
    IOHIDEventSystemClientRef system = IOHIDEventSystemClientCreate(kCFAllocatorDefault);
    IOHIDEventSystemClientSetMatching(system, sensors);
    CFArrayRef matchingsrvs = IOHIDEventSystemClientCopyServices(system);

    long count = CFArrayGetCount(matchingsrvs);
    CFMutableArrayRef array = CFArrayCreateMutable(kCFAllocatorDefault, 0, &kCFTypeArrayCallBacks);

    for (int i = 0; i < count; i++) {
        IOHIDServiceClientRef sc = (IOHIDServiceClientRef)CFArrayGetValueAtIndex(matchingsrvs, i);
        IOHIDEventRef event = IOHIDServiceClientCopyEvent(sc, kIOHIDEventTypeTemperature, 0, 0); // here we use ...CopyEvent

        CFNumberRef value;
        if (event != 0) {
            double temp = IOHIDEventGetFloatValue(event, IOHIDEventFieldBase(kIOHIDEventTypeTemperature));
            value = CFNumberCreate(kCFAllocatorDefault, kCFNumberDoubleType, &temp);
        } else {
            double temp = 0;
            value = CFNumberCreate(kCFAllocatorDefault, kCFNumberDoubleType, &temp);
        }
        CFArrayAppendValue(array, value);
    }
    return array;
}

void dumpValues(CFArrayRef values)
{
    long count = CFArrayGetCount(values);
    for (int i = 0; i < count; i++) {
        CFNumberRef value = CFArrayGetValueAtIndex(values, i);
        double temp = 0.0;
        CFNumberGetValue(value, kCFNumberDoubleType, &temp);
        printf("%0.1lf_", temp);
    }
}

void dumpNames(CFArrayRef names, char *cat)
{
    long count = CFArrayGetCount(names);
    for (int i = 0; i < count; i++) {
        NSString *name = (NSString *)CFArrayGetValueAtIndex(names, i);
        printf("%s_", [name UTF8String]);
    }
}


#if 1
int main(int argc, const char * argv[]){
    CFDictionaryRef thermalSensors = matching(0xff00, 5);
    CFArrayRef thermalNames = getProductNames(thermalSensors);
    CFArrayRef thermalValues = getThermalValues(thermalSensors);

    if(strcmp(argv[1],"n") == 0){
        dumpNames(thermalNames, "C");
        printf("\n"); fflush(stdout);
    }

    if(strcmp(argv[1],"v") == 0){
        dumpValues(thermalValues);
        printf("\n"); fflush(stdout);
    }
    return 0;
}
#endif
